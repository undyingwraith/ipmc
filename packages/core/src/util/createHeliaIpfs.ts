import { dnsLink } from '@helia/dnslink';
import { ipns } from '@helia/ipns';
import { unixfs } from '@helia/unixfs';
import { peerIdFromString } from '@libp2p/peer-id';
import { Helia } from 'helia';
import { IFileInfo, IIpfsService } from 'ipmc-interfaces';
import { Libp2p } from 'libp2p';
import { CID } from 'multiformats';
import { concat } from 'uint8arrays';
import { parseIpns } from './parseIpns';

export function createHeliaIpfs(helia: Helia<Libp2p<any>>, onClose: () => Promise<void>): IIpfsService {
	const fs = unixfs(helia);
	const ns = ipns(helia);
	const nsl = dnsLink(helia);

	return ({
		async ls(cid: string) {
			const files: IFileInfo[] = [];
			for await (const file of fs.ls(CID.parse(cid), {
				//TODO: signal,
			})) {
				files.push({
					type: file.type == 'directory' ? 'dir' : 'file',
					name: file.name,
					cid: file.cid.toString(),
				});
			}
			return files;
		},
		async stop() {
			await helia.stop();
			await onClose();
		},
		peers() {
			return Promise.resolve(helia.libp2p.getPeers().map(p => ({
				peer: p.toString(),
				addrs: helia.libp2p.getConnections(p).map(c => c.remoteAddr.toString()),
			})));
		},
		id() {
			return helia.libp2p.peerId.toString();
		},
		async resolve(name) {
			const ipns = parseIpns(name);
			let resolved;
			if (ipns.dnsLink) {
				const answers = await nsl.resolve(ipns.name);
				if (answers[0] == undefined) {
					throw new Error('No records found');
				}
				if (answers[0].namespace == 'ipfs') {
					resolved = answers[0].cid;
				} else {
					resolved = (await ns.resolve(answers[0].peerId)).cid;
				}
			} else {
				resolved = (await ns.resolve(peerIdFromString(ipns.name))).cid;
			}
			if (ipns.path !== '/') {
				resolved = await (await fs.stat(resolved, { path: ipns.path })).cid;
			}
			return resolved.toV1().toString();

		},
		isPinned(cid) {
			return helia.pins.isPinned(CID.parse(cid));
		},
		async addPin(cid) {
			for await (const block of helia.pins.add(CID.parse(cid))) {
				console.log(`Pin progress ${cid}: ${block.toString()}`);
			}
		},
		async rmPin(cid) {
			for await (const block of helia.pins.rm(CID.parse(cid))) {
				console.log(`Pin progress ${cid}: ${block.toString()}`);
			}
		},
		async fetch(cid: string, path?: string) {
			const data: Uint8Array[] = [];
			for await (const buf of fs.cat(CID.parse(cid), {
				path
			})) {
				data.push(buf);
			}
			return concat(data);
		},
		async handle(protocol, handler) {
			await helia.libp2p.handle(protocol, handler);
		},
		async register(protocol, topology) {
			await helia.libp2p.register(protocol, topology);
		},
	});
}
