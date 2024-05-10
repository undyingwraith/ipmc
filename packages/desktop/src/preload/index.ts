import { contextBridge } from 'electron';
//import { electronAPI } from '@electron-toolkit/preload';

import { webSockets } from '@libp2p/websockets';
import { webTransport } from '@libp2p/webtransport';
import { preSharedKey } from "@libp2p/pnet";
import { noise } from "@chainsafe/libp2p-noise";
import { tcp } from '@libp2p/tcp';
import { peerIdFromString } from '@libp2p/peer-id';
import { bootstrap } from '@libp2p/bootstrap';
import { circuitRelayTransport, circuitRelayServer } from '@libp2p/circuit-relay-v2';

import { CID } from 'multiformats';
import { FsBlockstore } from 'blockstore-fs';
import { LevelDatastore } from 'datastore-level';
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { ipns } from '@helia/ipns';
import { bitswap, trustlessGateway } from '@helia/block-brokers';
import { create } from 'kubo-rpc-client';
import fs from 'fs';

import { IConfigurationService, INodeService, IInternalProfile, IProfile, IIpfsService, IFileInfo } from 'ipmc-core';
import express from 'express';
import { Server, IncomingMessage, ServerResponse } from 'http';

function getProfileFolder(name: string): string {
	return `./profiles/${name}`;
}

const nodeService: INodeService = {
	async create(profile: IInternalProfile): Promise<IIpfsService> {
		const datastore = new LevelDatastore(`${getProfileFolder(profile.name)}/data`);
		await datastore.open();
		const blockstore = new FsBlockstore(`${getProfileFolder(profile.name)}/blocks`);
		await blockstore.open();

		const helia = await createHelia({
			start: true,
			datastore,
			blockstore,
			libp2p: {
				...(profile.swarmKey ? {
					connectionProtector: preSharedKey({
						psk: new TextEncoder().encode(profile.swarmKey),
					}),
				} : {}),
				transports: [
					webSockets(),
					webTransport(),
					tcp(),
					circuitRelayTransport(),
				],
				peerDiscovery: [
					bootstrap({
						list: profile.bootstrap ?? [
							// a list of bootstrap peer multiaddrs to connect to on node startup
							'/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
							'/dnsaddr/bootstrap.libp2p.io/ipfs/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
							'/dnsaddr/bootstrap.libp2p.io/ipfs/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa'
						],
					}),
				],
				connectionEncryption: [noise()],
				services: {
					circuitRelay: circuitRelayServer()
				}
			},
			blockBrokers: [
				bitswap(),
				...(profile.swarmKey == undefined ? [trustlessGateway()] : [])
			],
		});

		const fs = unixfs(helia);

		const app = express();
		app.get('/:cid', async (request, response) => {
			for await (const buf of fs.cat(CID.parse(request.params.cid))) {
				response.write(buf);
			}
			response.end();
		});
		const server = await new Promise<Server<typeof IncomingMessage, typeof ServerResponse>>((resolve) => {
			const server = app.listen(8090, '127.0.0.1', () => resolve(server));
		});

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
				server.close();
				await helia.stop();
				await blockstore.close();
				await datastore.close();
			},
			toUrl(cid: string) {
				return `http://127.0.0.1:8090/${cid}`;
			},
			peers() {
				return Promise.resolve(helia.libp2p.getPeers().map(p => p.toString()));
			},
			async resolve(name) {
				try {
					return (await ipns(helia).resolve(peerIdFromString(name))).cid.toString();
				} catch (ex) {
					return (await ipns(helia).resolveDNSLink(name)).cid.toString();
				}
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
			},
			async resolve(name) {
				let result = '';
				for await (const res of node.name.resolve(name)) {
					result = res;
				}

				return result;
			},
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
