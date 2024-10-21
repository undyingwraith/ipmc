import { IFileInfo, IIpfsService } from 'ipmc-interfaces';
import { create } from 'kubo-rpc-client';
import { concat } from 'uint8arrays';

export async function createRemoteIpfs(url?: string): Promise<IIpfsService> {
	const node = create({ url });
	const connString = (await node.config.get('Addresses.Gateway')) as string;
	const port = connString.substring(connString.lastIndexOf('/') + 1);
	const id = (await node.id()).id.toString();

	return {
		async ls(cid: string) {
			const files: IFileInfo[] = [];
			for await (const file of node.ls(cid)) {
				files.push({
					type: file.type,
					name: file.name,
					cid: file.cid.toString(),
				});
			}
			return files;
		},
		stop() {
			return Promise.resolve();
		},
		id() {
			return id;
		},
		async peers() {
			return (await node.swarm.peers()).map(p => p.addr.toString() + '/' + p.peer.toString());
		},
		async resolve(name) {
			let result = '';
			for await (const res of node.name.resolve(name.at(0) == '/' ? name : '/ipns/' + name)) {
				result = res;
			}

			return result;
		},
		async isPinned(cid) {
			for await (const res of node.pin.ls({
				paths: cid,
			})) {
				if (res.cid.toString() == cid) {
					return true;
				}
			}
			return false;
		},
		async addPin(cid) {
			await node.pin.add(cid);
		},
		async rmPin(cid) {
			await node.pin.rm(cid);
		},
		async fetch(cid: string, path?: string) {
			const parts = [];
			for await (const buf of node.cat(path ? path.startsWith('/') ? cid + path : cid + '/' + path : cid)) {
				parts.push(buf);
			}
			return concat(parts);
		}
	};
}
