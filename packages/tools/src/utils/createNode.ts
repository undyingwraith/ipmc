import { create } from "kubo-rpc-client";

export function createNode() {
	//TODO: env vars
	return create({
		url: process.env.IPFS_URL ?? 'http://127.0.0.1:5001'
	});
}