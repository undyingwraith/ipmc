use ipld_core::cid::Cid;
use libp2p::pnet::PreSharedKey;
use rust_ipfs::builder::DefaultIpfsBuilder;
use rust_ipfs::unixfs::Entry;
use rust_ipfs::{Ipfs, IpfsPath, Keypair};
use serde::Serialize;
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
			match profile {
				Profile::Internal(inner) => Ok(inner),
				Profile::Remote(_) => Err(IpmcError::InvalidProfile)
			}
		}?;

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

		let port = profile.port.unwrap_or(0);
		let mut builder = DefaultIpfsBuilder::with_keypair(&keypair)?
			.enable_tcp()
			.enable_quic()
			.enable_dns()
			.enable_secure_websocket()
			.enable_websocket()
			.set_listening_addrs(vec![
				format!("/ip4/0.0.0.0/tcp/{}", port)
					.parse()
					.map_err(anyhow::Error::msg)?,
				format!("/ip6/::/tcp/{}", port).parse().map_err(anyhow::Error::msg)?,
				format!("/ip4/0.0.0.0/udp/{}/quic-v1", port)
					.parse()
					.map_err(anyhow::Error::msg)?,
				format!("/ip6/::/udp/{}/quic-v1", port)
					.parse()
					.map_err(anyhow::Error::msg)?,
				//format!("/ip4/0.0.0.0/udp/{}/webrtc-direct", port).parse().map_err(anyhow::Error::msg)?,
				//format!("/ip6/::/udp/{}/webrtc-direct", port).parse().map_err(anyhow::Error::msg)?,
				format!("/ip4/0.0.0.0/tcp/{}/ws", port)
					.parse()
					.map_err(anyhow::Error::msg)?,
				format!("/ip6/::/tcp/{}/ws", port).parse().map_err(anyhow::Error::msg)?,
			])
			.with_identify(Default::default())
			.with_autonat()
			.with_bitswap()
			.with_kademlia()
			.with_ping(Default::default())
			.with_pubsub(Default::default())
			.with_mdns()
			.with_relay(true)
			.with_relay_server(Default::default())
			.with_upnp()
			.with_autorelay()
			.default_record_key_validator()
			.set_path(path);
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

		println!("Listening Addresses:");
		let addrs = ipfs.listening_addresses().await?;
		for addr in addrs {
			println!("{addr}");
		}

		Ok(IpmcNode { ipfs })
	}

	pub async fn id(&self) -> Result<String, IpmcError> {
		let id = self.ipfs.identity(None).await?;
		Ok(id.peer_id.to_base58())
	}

	pub async fn add_pin(&self, cid: &str) -> Result<(), IpmcError> {
		let cid = Cid::from_str(cid)?;
		self.ipfs.insert_pin(cid).await?;
		Ok(())
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
			res.push(PeerInfo {
				peer: peer.to_base58(),
				addrs: Vec::new(),
			});
			/*
			let id = self.ipfs.identity(Some(peer)).await?;
			res.push(PeerInfo {
				peer: id.peer_id.to_base58(),
				addrs: Vec::from([id.observed_addr.map(|p| p.to_string()).unwrap_or("t".to_owned())]),
			});
			 */
		}

		Ok(res)
	}

	pub async fn resolve(&self, name: &str) -> Result<String, IpmcError> {
		let name = if !name.starts_with("/") && name.contains(".") {
			format!("/ipns/{name}")
		} else {
			name.to_owned()
		};
		let ipns_path = IpfsPath::from_str(&name)?;
		Ok(self.ipfs.resolve_ipns(&ipns_path, true).await?.to_string())
	}

	pub async fn rm_pin(&self, cid: &str) -> Result<(), IpmcError> {
		let cid = Cid::from_str(cid)?;
		self.ipfs.remove_pin(cid).await?;
		Ok(())
	}

	pub async fn stop(self) {
		self.ipfs.exit_daemon().await;
	}
}

#[derive(Serialize)]
pub struct PeerInfo {
	pub peer: String,
	pub addrs: Vec<String>,
}

#[derive(Serialize)]
pub struct FileInfo {
	pub cid: String,
	pub name: String,
	#[serde(rename = "type")]
	pub file_type: String,
}
