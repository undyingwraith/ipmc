import { ipns } from '@helia/ipns';
import { unixfs } from '@helia/unixfs';
import { peerIdFromString } from '@libp2p/peer-id';
import { HeliaLibp2p } from 'helia';
import { IFileInfo, IIpfsService } from 'ipmc-interfaces';
import { Libp2p } from 'libp2p';
import { CID } from 'multiformats';
import { concat } from 'uint8arrays';
import { parseIpns } from './parseIpns';

export function createHeliaIpfs(helia: HeliaLibp2p<Libp2p<any>>, onClose: () => Promise<void>): IIpfsService {
	const fs = unixfs(helia);
	const ns = ipns(helia);

	return ({
		async ls(cid: string, signal) {
			const files: IFileInfo[] = [];
			for await (const file of fs.ls(CID.parse(cid), {
				signal,
			})) {
				files.push({
					type: file.type == 'directory' ? 'dir' : 'file',
					name: file.name,
					cid: file.cid.toV1().toString(),
				});
			}
			return files;
		},
		async stop() {
			await helia.stop();
			await onClose();
		},
		peers() {
			return Promise.resolve(helia.libp2p.getConnections().map(p => p.remoteAddr.toString()));
		},
		id() {
			return helia.libp2p.peerId.toString();
		},
		async resolve(name) {
			const ipns = parseIpns(name);
			let resolved;
			if (ipns.dnsLink) {
				resolved = (await ns.resolveDNSLink(ipns.name)).cid;
			} else {
				resolved = (await ns.resolve(peerIdFromString(ipns.name).publicKey!)).cid;
			}
			if (ipns.path !== '/') {
				resolved = await (await fs.stat(resolved, { path: ipns.path })).cid;
			}
			return resolved.toV1().toString();

		},
		isPinned(cid) {
			return helia.pins.isPinned(CID.parse(cid).toV1());
		},
		async addPin(cid) {
			for await (const block of helia.pins.add(CID.parse(cid).toV1())) {
				console.log(`Pin progress ${cid}: ${block.toString()}`);
			}
		},
		async rmPin(cid) {
			for await (const block of helia.pins.rm(CID.parse(cid).toV1())) {
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
		async lsPins() {
			const pins: string[] = [];
			for await (const pin of helia.pins.ls()) {
				pins.push(pin.cid.toV1().toString());
			}
			return pins;
		}
	});
}
