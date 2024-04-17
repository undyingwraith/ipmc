import { IPFSHTTPClient } from "kubo-rpc-client/types";

export async function publish(ipfs: IPFSHTTPClient, path: string, key: string | undefined) {
	const res = await ipfs.files.stat(path);

	console.log(`${path} => ${res.cid.toString()}`);
	console.log(`Publishing to key ${key}`);

	await ipfs.name.publish(res.cid, {
		key: key,
	});

	console.log('Done!');
}
