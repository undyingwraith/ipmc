use ipmc_node::Library;
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
	pub(crate) id: String,
	name: String,
	port: Option<i32>,
	swarm_key: Option<String>,
	bootstrap: Option<Vec<String>>,
	libraries: Vec<Library>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RemoteProfile {
	id: String,
	name: String,
	url: Option<String>,
	libraries: Vec<Library>,
}


impl Into<ipmc_node::Profile> for Profile {
	fn into(self) -> ipmc_node::Profile {
		match self {
			Profile::Internal(inner) => ipmc_node::Profile::Internal(inner.into()),
			Profile::Remote(inner) => ipmc_node::Profile::Remote(inner.into()),
		}
	}
}

impl Profile {
	pub fn from_profile(profile: ipmc_node::Profile, id: String) -> Profile {
		match profile {
			ipmc_node::Profile::Internal(inner) => Profile::Internal(InternalProfile::from_profile(inner, id)),
			ipmc_node::Profile::Remote(inner) => Profile::Remote(RemoteProfile::from_profile(inner, id)),
		}
	}
}

impl Into<ipmc_node::InternalProfile> for InternalProfile {
	fn into(self) -> ipmc_node::InternalProfile {
		ipmc_node::InternalProfile {
			name: self.name,
			port: self.port,
			bootstrap: self.bootstrap,
			swarm_key: self.swarm_key,
			libraries: self.libraries,
		}
	}
}

impl InternalProfile {
	fn from_profile(profile: ipmc_node::InternalProfile, id: String) -> InternalProfile {
		InternalProfile {
			id,
			name: profile.name,
			port: profile.port,
			bootstrap: profile.bootstrap,
			swarm_key: profile.swarm_key,
			libraries: profile.libraries,
		}
	}
}

impl Into<ipmc_node::RemoteProfile> for RemoteProfile {
	fn into(self) -> ipmc_node::RemoteProfile {
		ipmc_node::RemoteProfile {
			name: self.name,
			url: self.url,
			libraries: self.libraries,
		}
	}
}

impl RemoteProfile {
	fn from_profile(profile: ipmc_node::RemoteProfile, id: String) -> RemoteProfile {
		RemoteProfile {
			id,
			name: profile.name,
			url: profile.url,
			libraries: profile.libraries,
		}
	}
}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn can_parse_internal() {
		let profile = r#"{
  "type": "internal",
  "id": "test-id",
  "name": "Default",
  "port": 6060,
  "swarmKey": "/key/swarm/psk/1.0.0/\n/base16/\nexample",
  "bootstrap": [
    "/dnsaddr/example.com/p2p/12D3KooWT32d14NuEWbGLrAhZFyqQHFzmeDDtLiw7FsTDFJU8Xhz"
  ],
  "libraries": [
    {
      "id": "c2cef98e-5d51-4c64-82ad-276290c26c2f",
      "type": "movie",
      "name": "Example",
      "upstream": "example.com"
    }
  ]
}"#;

		let parsed: Profile = serde_json::from_str(profile).unwrap();
		let serialized = serde_json::to_string_pretty(&parsed).unwrap();
		assert_eq!(serialized, profile);
	}

	#[test]
	fn can_parse_remote() {
		let profile = r#"{
  "type": "remote",
  "id": "test-id",
  "name": "Default-Remote",
  "url": "/ip4/127.0.0.1/tcp/5002",
  "libraries": [
    {
      "id": "c2cef98e-5d51-4c64-82ad-276290c26c2f",
      "type": "movie",
      "name": "Example",
      "upstream": "example.com"
    }
  ]
}"#;

		let parsed: Profile = serde_json::from_str(profile).unwrap();
		let serialized = serde_json::to_string_pretty(&parsed).unwrap();
		assert_eq!(serialized, profile);
	}
}
