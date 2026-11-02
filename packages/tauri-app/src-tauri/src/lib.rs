use directories::BaseDirs;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

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

#[derive(Serialize, Deserialize)]
struct Profile {
	id: String,
	name: String,
	libraries: Vec<Library>,
	port: Option<i32>,
	swarm_key: Option<String>,
	bootstrap: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize)]
struct Library {
	id: String,
	name: String,
	upstream: String,
	r#type: String,
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
fn create_node(profile: Profile) {}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder::default()
		.plugin(tauri_plugin_opener::init())
		.invoke_handler(tauri::generate_handler![
			get_profile,
			get_profiles,
			remove_profile,
			set_profile,
			create_node
		])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
