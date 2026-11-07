use ipld_core::cid::Cid;
use rust_ipfs::builder::DefaultIpfsBuilder;
use rust_ipfs::prelude::transport::pnet::PreSharedKey;
use rust_ipfs::unixfs::Entry;
use rust_ipfs::{Ipfs, IpfsPath, Keypair};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::str::FromStr;

use crate::{IpmcError, Profile};

#[derive(Debug)]
pub struct IpmcNode {
	ipfs: Ipfs,
}

impl IpmcNode {
	pub async fn from_path(path: &PathBuf) -> Result<IpmcNode, IpmcError> {
		if !path.is_dir() {
			return Err(IpmcError::InvalidPath);
		}

		let profile = {
			let mut profile_path = path.clone();
			profile_path.push("profile.json");

			let data = fs::read_to_string(profile_path)?;
			let profile: Profile = serde_json::from_str(&data)?;
			profile
		};

		let keypair = {
			let mut id_path = path.clone();
			id_path.push("identity");
			if fs::exists(&id_path).expect("Failed to check for identity") {
				let encoded = fs::read(id_path)?;
				Keypair::from_protobuf_encoding(&encoded)?
			} else {
				let key = Keypair::generate_ed25519();
				let encoded = key.to_protobuf_encoding().map_err(anyhow::Error::msg)?;
				fs::write(id_path, encoded)?;
				key
			}
		};

		let mut builder = DefaultIpfsBuilder::with_keypair(&keypair)?
			.with_default()
			.enable_tcp()
			.enable_quic()
			.enable_dns()
			.add_listening_addr("/ip4/0.0.0.0/tcp/0".parse().map_err(anyhow::Error::msg)?)
			.with_mdns()
			.with_relay(true)
			.with_relay_server(Default::default())
			.with_upnp();
		if let Some(ref key) = profile.swarm_key {
			let psk = PreSharedKey::from_str(key)?;

			builder = builder.enable_pnet(psk);
		}

		// Start & bootstrap ipfs
		let ipfs = builder.start().await?;
		if let Some(ref bootstrap) = profile.bootstrap {
			for addr in bootstrap {
				ipfs.add_bootstrap(addr.parse().map_err(anyhow::Error::msg)?).await?;
			}
		} else {
			ipfs.default_bootstrap().await?;
		}
		ipfs.bootstrap().await?;

		Ok(IpmcNode { ipfs })
	}

	pub async fn id(&self) -> Result<String, IpmcError> {
		let id = self.ipfs.identity(None).await?;
		Ok(id.peer_id.to_base58())
	}

	pub async fn add_pin(&self, cid: &str) -> Result<(), IpmcError> {
		let cid = Cid::from_str(cid)?;
		let res = self.ipfs.insert_pin(cid).await?;
		Ok(res)
	}

	pub async fn fetch(&self, cid: &str, path: &str) -> Result<Vec<u8>, IpmcError> {
		let path = IpfsPath::from_str(&format!("{cid}{path}"))?;
		let data = self.ipfs.cat_unixfs(path).await?;

		Ok(data.to_vec())
	}

	pub async fn is_pinned(&self, cid: &str) -> Result<bool, IpmcError> {
		let cid = Cid::from_str(cid)?;
		let res = self.ipfs.is_pinned(cid).await?;
		Ok(res)
	}

	pub async fn ls(&self, cid: &str) -> Result<Vec<FileInfo>, IpmcError> {
		let cid = Cid::from_str(cid)?;
		let res = self.ipfs.ls_unixfs(cid).await?;
		let mut entries = Vec::new();
		for item in res {
			let entry = match item {
				Entry::Error { error: _ } => None,
				Entry::File { cid, file, size: _ } => Some(FileInfo {
					cid: cid.to_string(),
					file_type: "file".to_owned(),
					name: file,
				}),
				Entry::Directory { cid, path } => Some(FileInfo {
					cid: cid.to_string(),
					name: path,
					file_type: "dir".to_owned(),
				}),
				Entry::RootDirectory { cid: _, path: _ } => None,
			};
			if let Some(value) = entry {
				entries.push(value);
			}
		}
		Ok(entries)
	}

	pub async fn peers(&self) -> Result<Vec<PeerInfo>, IpmcError> {
		let peers = self.ipfs.get_bitswap_peers().await?;
		let mut res = Vec::new();
		for peer in peers {
			let id = self.ipfs.identity(Some(peer)).await?;
			res.push(PeerInfo {
				peer: id.peer_id.to_base58(),
				addrs: Vec::from([id.observed_addr.map(|p| p.to_string()).unwrap_or("t".to_owned())]),
			})
		}

		Ok(res)
	}

	pub async fn resolve(&self, name: &str) -> Result<String, IpmcError> {
		let ipns_path = IpfsPath::from_str(name)?;
		Ok(self.ipfs.resolve_ipns(&ipns_path, true).await?.to_string())
	}

	pub async fn rm_pin(&self, cid: &str) -> Result<(), IpmcError> {
		let cid = Cid::from_str(cid)?;
		let res = self.ipfs.remove_pin(cid).await?;
		Ok(res)
	}

	pub async fn stop(self) {
		self.ipfs.exit_daemon().await;
	}
}

#[derive(Serialize, Deserialize)]
pub struct PeerInfo {
	peer: String,
	addrs: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct FileInfo {
	pub cid: String,
	pub name: String,
	#[serde(rename = "type")]
	pub file_type: String,
}
