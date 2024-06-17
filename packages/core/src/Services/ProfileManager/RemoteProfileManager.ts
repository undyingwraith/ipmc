import { IFileInfo, IRemoteProfile } from "ipmc-interfaces";
import { BaseProfileManager } from "./BaseProfileManager";
import { create } from 'kubo-rpc-client';

export class RemoteProfileManager extends BaseProfileManager<IRemoteProfile> {
	constructor(profile: IRemoteProfile) {
		super(profile);
	}

	protected async startNode() {
		const node = create({ url: this.profile.url });
		const connString = (await node.config.get('Addresses.Gateway')) as string;
		const port = connString.substring(connString.lastIndexOf('/') + 1);
		const id = (await node.id()).id.toString();

		this.ipfs = {
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
			toUrl(cid: string) {
				return `http://127.0.0.1:${port}/ipfs/${cid}`;
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
		};
	}

	protected stopNode() {
		return Promise.resolve();
	}
}
