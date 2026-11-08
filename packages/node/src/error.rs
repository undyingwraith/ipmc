use thiserror::Error;

#[derive(Debug, Error)]
pub enum IpmcError {
	#[error("Path given is not a directory")]
	InvalidPath,

	#[error(transparent)]
	File(#[from] std::io::Error),

	#[error(transparent)]
	Anyhow(#[from] anyhow::Error),

	#[error(transparent)]
	Decoding(#[from] libp2p::identity::DecodingError),

	#[error(transparent)]
	KeyParse(#[from] libp2p::pnet::KeyParseError),

	#[error(transparent)]
	Json(#[from] serde_json::Error),

	#[error(transparent)]
	Ipld(#[from] ipld_core::cid::Error),

	#[error(transparent)]
	Traversal(#[from] rust_ipfs::unixfs::TraversalFailed),
}
