use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Profile {
	pub id: String,
	#[serde(rename = "type")]
	pub profile_type: String,
	pub name: String,
	pub libraries: Vec<Library>,
	pub url: Option<String>,
	pub port: Option<i32>,
	pub swarm_key: Option<String>,
	pub bootstrap: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize)]
pub struct Library {
	id: String,
	name: String,
	upstream: String,
	#[serde(rename = "type")]
	library_type: String,
}
