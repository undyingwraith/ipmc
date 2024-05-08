import { contextBridge } from 'electron';
//import { electronAPI } from '@electron-toolkit/preload';

import { webSockets } from '@libp2p/websockets';
import { webTransport } from '@libp2p/webtransport';
import { preSharedKey } from "@libp2p/pnet";
import { createLibp2p } from 'libp2p';
import { noise } from "@chainsafe/libp2p-noise";
import { tcp } from '@libp2p/tcp';
import { bootstrap } from '@libp2p/bootstrap';

import { CID } from 'multiformats';
import { FsBlockstore } from 'blockstore-fs';
import { LevelDatastore } from 'datastore-level';
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { create } from 'kubo-rpc-client';
import fs from 'fs';

import { IConfigurationService, INodeService, IInternalProfile, IProfile, IIpfsService, IFileInfo } from 'ipmc-core';

function getProfileFolder(name: string): string {
	return `./profiles/${name}`;
}

const nodeService: INodeService = {
	async create(profile: IInternalProfile): Promise<IIpfsService> {
		const libp2p = await createLibp2p({
			...(profile.swarmKey ? {
				connectionProtector: preSharedKey({
					psk: new TextEncoder().encode(profile.swarmKey),
				}),
			} : {}),
			transports: [
				webSockets(),
				webTransport(),
				tcp(),
			],
			peerDiscovery: [
				bootstrap({
					list: profile.bootstrap ?? [
						// a list of bootstrap peer multiaddrs to connect to on node startup
						'/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
						'/dnsaddr/bootstrap.libp2p.io/ipfs/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
						'/dnsaddr/bootstrap.libp2p.io/ipfs/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa'
					]
				})
			],
			connectionEncryption: [noise()],
		});

		const datastore = new LevelDatastore(`${getProfileFolder(profile.name)}/data`);
		await datastore.open();
		const blockstore = new FsBlockstore(`${getProfileFolder(profile.name)}/blocks`);
		await blockstore.open();

		const helia = await createHelia({
			start: true,
			datastore,
			blockstore,
			libp2p: libp2p,
		});

		const fs = unixfs(helia);

		return ({
			async ls(cid: string) {
				const files: IFileInfo[] = [];
				for await (const file of fs.ls(CID.parse(cid))) {
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
				await blockstore.close();
				await datastore.close();
			},
			toUrl(cid: string) {
				return `TODO ${cid}`;
			},
			peers() {
				return Promise.resolve(helia.libp2p.getPeers().map(p => p.toString()));
			},
		});
	},
	async createRemote(url: string): Promise<IIpfsService> {
		const node = create({ url: url });
		const connString = (await node.config.get("Addresses.Gateway")) as string;
		const port = connString.substring(connString.lastIndexOf('/') + 1);
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
			toUrl(cid: string) {
				return `http://127.0.0.1:${port}/ipfs/${cid}`;
			},
			async peers() {
				return (await node.swarm.peers()).map(p => p.addr.toString());
			}
		};
	}
};

const configService: IConfigurationService = {
	getProfiles(): string[] {
		try {
			const profiles = fs.readdirSync('./profiles');
			return profiles;
		} catch (_) {
			return [];
		}
	},
	getProfile(name: string): IProfile {
		return JSON.parse(fs.readFileSync(getProfileFolder(name) + '/profile.json', 'utf-8'));
	},
	setProfile(name: string, profile: IProfile) {
		fs.writeFileSync(getProfileFolder(name) + '/profile.json', JSON.stringify(profile));
	},
	removeProfile(name) {
		fs.rmdirSync(getProfileFolder(name), { recursive: true });
	},
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		//contextBridge.exposeInMainWorld('electron', electronAPI);
		contextBridge.exposeInMainWorld('nodeService', nodeService);
		contextBridge.exposeInMainWorld('configService', configService);
		console.log("exposeInMainWorld");
	} catch (error) {
		console.error(error);
	}
} else {
	console.log("window");
	// @ts-ignore (define in dts)
	//window.electron = electronAPI
	// @ts-ignore (define in dts)
	window.configService = configService;
	// @ts-ignore (define in dts)
	window.nodeService = nodeService;
}
