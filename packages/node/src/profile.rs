use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
#[serde(tag = "type")]
pub enum Profile {
	#[serde(rename = "internal")]
	Internal(InternalProfile),
	#[serde(rename = "remote")]
	Remote(RemoteProfile),
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct InternalProfile {
	pub name: String,
	pub port: Option<i32>,
	pub swarm_key: Option<String>,
	pub bootstrap: Option<Vec<String>>,
	pub libraries: Vec<Library>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RemoteProfile {
	pub name: String,
	pub url: Option<String>,
	pub libraries: Vec<Library>,
}

#[derive(Serialize, Deserialize)]
pub struct Library {
	id: String,
	#[serde(rename = "type")]
	library_type: LibraryType,
	name: String,
	upstream: String,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum LibraryType {
	Movie,
	Series,
	Music,
}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn can_parse_internal() {
		let profile = r#"{
  "type": "internal",
  "name": "Default",
  "port": 6060,
  "swarmKey": "/key/swarm/psk/1.0.0/\n/base16/\nexample",
  "bootstrap": [
    "/dnsaddr/example.com/p2p/12D3KooWT32d14NuEWbGLrAhZFyqQHFzmeDDtLiw7FsTDFJU8Xhz"
  ],
  "libraries": []
}"#;

		let parsed: Profile = serde_json::from_str(profile).unwrap();
		let serialized = serde_json::to_string_pretty(&parsed).unwrap();
		assert_eq!(serialized, profile);
	}

	#[test]
	fn can_parse_remote() {
		let profile = r#"{
  "type": "remote",
  "name": "Default-Remote",
  "url": "/ip4/127.0.0.1/tcp/5002",
  "libraries": []
}"#;

		let parsed: Profile = serde_json::from_str(profile).unwrap();
		let serialized = serde_json::to_string_pretty(&parsed).unwrap();
		assert_eq!(serialized, profile);
	}

	#[test]
	fn can_parse_library() {
		let movie = r#"{
  "id": "c2cef98e-5d51-4c64-82ad-276290c26c2f",
  "type": "movie",
  "name": "Example",
  "upstream": "example.com"
}"#;
		let movie_parsed: Library = serde_json::from_str(movie).unwrap();
		assert_eq!(movie_parsed.library_type, LibraryType::Movie);
		assert_eq!(movie_parsed.name, "Example");
		assert_eq!(movie_parsed.upstream, "example.com");
		assert_eq!(movie_parsed.id, "c2cef98e-5d51-4c64-82ad-276290c26c2f");
		let movie_serialized = serde_json::to_string_pretty(&movie_parsed).unwrap();
		assert_eq!(movie_serialized, movie);
	}
}
