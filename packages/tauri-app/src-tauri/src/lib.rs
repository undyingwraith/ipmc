use directories::BaseDirs;
use ipmc_node::{FileInfo, IpmcNode, PeerInfo, Profile};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use tokio::sync::RwLock;
use tokio::sync::oneshot;

mod error;

use crate::error::IpmcDesktopError;

fn get_profile_folder(id: Option<&str>) -> PathBuf {
	//TODO: better error handling maybe?
	let base_dirs = BaseDirs::new().expect("Couldn't get app storage directory");
	let mut path = PathBuf::from(base_dirs.config_dir());
	path.push("ipmc-desktop");
	path.push("Data");
	path.push("profiles");
	if let Some(id) = id {
		path.push(id);
	}
	path
}

#[tauri::command]
fn get_profile(id: &str) -> Result<Profile, String> {
	let mut path = get_profile_folder(Some(id));
	path.push("profile.json");
	let data = fs::read_to_string(path).map_err(|_| "Failed to read file")?;
	let profile: Profile = serde_json::from_str(&data).map_err(|_| "Failed to parse json")?;

	Ok(profile)
}

#[tauri::command]
fn get_profiles() -> Vec<String> {
	let path = get_profile_folder(None);
	if let Ok(profiles) = fs::read_dir(path) {
		profiles
			.into_iter()
			.filter_map(|p| {
				if p.as_ref().is_ok_and(|d| d.metadata().is_ok_and(|m| m.is_dir())) {
					//TODO: verify profile.json exists
					Some(p.unwrap().file_name().into_string().unwrap())
				} else {
					None
				}
			})
			.collect()
	} else {
		Vec::new()
	}
}

#[tauri::command]
fn remove_profile(id: &str) -> Result<(), String> {
	let path = get_profile_folder(Some(id));
	fs::remove_dir_all(path).map_err(|_| "Failed to remove profile")?;

	Ok(())
}

#[tauri::command]
fn set_profile(id: &str, profile: Profile) -> Result<(), String> {
	let mut path = get_profile_folder(Some(id));
	if !fs::exists(&path).map_err(|_| "failed to check dir existence")? {
		fs::create_dir_all(&path).map_err(|_| "Failed to create profile folder")?
	}

	path.push("profile.json");
	let json = serde_json::to_string(&profile).map_err(|_| "Failed to serialize profile")?;
	fs::write(path, json).map_err(|_| "Failed to write json file")?;

	Ok(())
}

#[tauri::command]
async fn create_node(app: AppHandle, profile: Profile) -> Result<(), IpmcDesktopError> {
	let state = app.state::<RwLock<AppState>>();
	{
		let state = state.read().await;
		if state.nodes.contains_key(&profile.id) {
			return Ok(());
		}
	}

	let path = get_profile_folder(Some(&profile.id));

	let (tx, rx) = oneshot::channel();
	// Spawn fresh channel using `smol` since part of the code does not have `Send`, but the `tokio` runtime requires it.
	smol::block_on(async {
		let node = IpmcNode::from_path(&path).await;
		let _ = tx.send(node);
	});

	let node = rx.await.map_err(anyhow::Error::msg)??;
	let mut state = state.write().await;
	state.nodes.insert(profile.id, node);

	Ok(())
}

#[tauri::command]
async fn ipfs_add_pin(app: AppHandle, id: &str, cid: &str) -> Result<(), IpmcDesktopError> {
	let state = app.state::<RwLock<AppState>>();
	let state = state.read().await;
	if state.nodes.contains_key(id) {
		let node = state.nodes.get(id).unwrap();
		node.add_pin(cid).await?;
		Ok(())
	} else {
		Err(IpmcDesktopError::NodeNotRunning)
	}
}

#[tauri::command]
async fn ipfs_fetch(app: AppHandle, id: &str, cid: &str, path: &str) -> Result<Vec<u8>, IpmcDesktopError> {
	let state = app.state::<RwLock<AppState>>();
	let state = state.read().await;
	if state.nodes.contains_key(id) {
		let node = state.nodes.get(id).unwrap();
		Ok(node.fetch(cid, path).await?)
	} else {
		Err(IpmcDesktopError::NodeNotRunning)
	}
}

#[tauri::command]
async fn ipfs_id(app: AppHandle, id: &str) -> Result<String, IpmcDesktopError> {
	let state = app.state::<RwLock<AppState>>();
	let state = state.read().await;
	if state.nodes.contains_key(id) {
		let node = state.nodes.get(id).unwrap();
		let id = node.id().await?;
		Ok(id)
	} else {
		Err(IpmcDesktopError::NodeNotRunning)
	}
}

#[tauri::command]
async fn ipfs_is_pinned(app: AppHandle, id: &str, cid: &str) -> Result<bool, IpmcDesktopError> {
	let state = app.state::<RwLock<AppState>>();
	let state = state.read().await;
	if state.nodes.contains_key(id) {
		let node = state.nodes.get(id).unwrap();
		Ok(node.is_pinned(cid).await?)
	} else {
		Err(IpmcDesktopError::NodeNotRunning)
	}
}

#[tauri::command]
async fn ipfs_ls(app: AppHandle, id: &str, cid: &str) -> Result<Vec<FileInfo>, IpmcDesktopError> {
	let state = app.state::<RwLock<AppState>>();
	let state = state.read().await;
	if state.nodes.contains_key(id) {
		let node = state.nodes.get(id).unwrap();
		Ok(node.ls(cid).await?)
	} else {
		Err(IpmcDesktopError::NodeNotRunning)
	}
}

#[tauri::command]
async fn ipfs_resolve(app: AppHandle, id: &str, ipns: &str) -> Result<String, IpmcDesktopError> {
	let state = app.state::<RwLock<AppState>>();
	let state = state.read().await;
	if state.nodes.contains_key(id) {
		let node = state.nodes.get(id).unwrap();
		Ok(node.resolve(ipns).await?)
	} else {
		Err(IpmcDesktopError::NodeNotRunning)
	}
}

#[tauri::command]
async fn ipfs_peers(app: AppHandle, id: &str) -> Result<Vec<PeerInfo>, IpmcDesktopError> {
	let state = app.state::<RwLock<AppState>>();
	let state = state.read().await;
	if state.nodes.contains_key(id) {
		let node = state.nodes.get(id).unwrap();
		Ok(node.peers().await?)
	} else {
		Err(IpmcDesktopError::NodeNotRunning)
	}
}

#[tauri::command]
async fn ipfs_rm_pin(app: AppHandle, id: &str, cid: &str) -> Result<(), IpmcDesktopError> {
	let state = app.state::<RwLock<AppState>>();
	let state = state.read().await;
	if state.nodes.contains_key(id) {
		let node = state.nodes.get(id).unwrap();
		node.rm_pin(cid).await?;
		Ok(())
	} else {
		Err(IpmcDesktopError::NodeNotRunning)
	}
}

#[tauri::command]
async fn ipfs_stop(app: AppHandle, id: &str) -> Result<(), String> {
	let state = app.state::<RwLock<AppState>>();
	let mut state = state.write().await;
	if state.nodes.contains_key(id) {
		let node = state.nodes.remove(id).unwrap();
		node.stop().await;
		Ok(())
	} else {
		Err("Node not running".to_string())
	}
}

#[derive(Default)]
struct AppState {
	nodes: HashMap<String, IpmcNode>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder::default()
		.setup(|app| {
			let state = AppState::default();
			app.manage(RwLock::new(state));
			Ok(())
		})
		.plugin(tauri_plugin_opener::init())
		.invoke_handler(tauri::generate_handler![
			get_profile,
			get_profiles,
			remove_profile,
			set_profile,
			create_node,
			ipfs_add_pin,
			ipfs_fetch,
			ipfs_id,
			ipfs_is_pinned,
			ipfs_ls,
			ipfs_peers,
			ipfs_resolve,
			ipfs_rm_pin,
			ipfs_stop,
		])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
