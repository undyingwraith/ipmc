use thiserror::Error;

#[derive(Debug, Error)]
pub enum IpmcDesktopError {
	#[error(transparent)]
	File(#[from] std::io::Error),

	#[error(transparent)]
	Anyhow(#[from] anyhow::Error),

	#[error(transparent)]
	Ipmc(#[from] ipmc_node::IpmcError),

	#[error("Node is not running")]
	NodeNotRunning,

	#[error("Node is not running")]
	InvalidProfile,
}

impl serde::Serialize for IpmcDesktopError {
	fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
	where
		S: serde::ser::Serializer,
	{
		serializer.serialize_str(self.to_string().as_ref())
	}
}
