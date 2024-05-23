import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { mplex } from '@libp2p/mplex';
import { bitswap, trustlessGateway } from '@helia/block-brokers';
import { ipns } from '@helia/ipns';
import { unixfs } from '@helia/unixfs';
import { bootstrap } from '@libp2p/bootstrap';
import { circuitRelayServer, circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { peerIdFromString } from '@libp2p/peer-id';
import { preSharedKey } from '@libp2p/pnet';
import { tcp } from '@libp2p/tcp';
import { webSockets } from '@libp2p/websockets';
import { kadDHT, removePrivateAddressesMapper } from '@libp2p/kad-dht';
import { FsBlockstore } from 'blockstore-fs';
import { LevelDatastore } from 'datastore-level';
import { contextBridge } from 'electron';
import express from 'express';
import fs from 'fs';
import { createHelia } from 'helia';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { IConfigurationService, IFileInfo, IInternalProfile, IIpfsService, INodeService, IProfile, createRemoteIpfsService } from 'ipmc-core';
import { CID } from 'multiformats';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';
import { mdns } from '@libp2p/mdns';

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
				addresses: {
					listen: [
						'/ip4/0.0.0.0/tcp/0',
						'/ip6/::/tcp/0',
						'/ws',
						'/wss',
						'/webrtc',
					],
				},
				...(profile.swarmKey ? {
					connectionProtector: preSharedKey({
						psk: new TextEncoder().encode(profile.swarmKey),
					}),
				} : {}),
				transports: [
					webSockets(),
					tcp(),
					circuitRelayTransport({
						discoverRelays: 1,
					}),
				],
				peerDiscovery: [
					bootstrap({
						list: profile.bootstrap ?? (profile.swarmKey != undefined ? [] : [
							// a list of bootstrap peer multiaddrs to connect to on node startup
							'/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
							'/dnsaddr/bootstrap.libp2p.io/ipfs/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
							'/dnsaddr/bootstrap.libp2p.io/ipfs/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
						]),
					}),
					pubsubPeerDiscovery(),
					mdns(),
				],
				connectionEncryption: [
					noise(),
				],
				streamMuxers: [
					yamux(),
					mplex(),
				],
				services: {
					relay: circuitRelayServer({
						advertise: true
					}),
					dht: kadDHT({
						protocol: '/ipfs/kad/1.0.0',
						peerInfoMapper: removePrivateAddressesMapper,
						allowQueryWithZeroPeers: true,
					}),
					pubsub: gossipsub({
						allowPublishToZeroTopicPeers: true,
						canRelayMessage: true,
					}),
				},
			},
			blockBrokers: [
				bitswap(),
				...(profile.swarmKey == undefined ? [trustlessGateway()] : [])
			],
		});

		console.log(helia.libp2p.getMultiaddrs().map(a => a.toString()));
		helia.libp2p.addEventListener('peer:connect', console.log);
		helia.libp2p.addEventListener('peer:disconnect', console.log);
		helia.libp2p.addEventListener('peer:discovery', console.log);

		const fs = unixfs(helia);

		const app = express();
		app.get('/:cid', async (request, response) => {
			for await (const buf of fs.cat(CID.parse(request.params.cid))) {
				response.write(buf);
			}
			response.end();
		});
		const gatewayPort = 8090;
		const server = await new Promise<Server<typeof IncomingMessage, typeof ServerResponse>>((resolve) => {
			const server = app.listen(gatewayPort, '127.0.0.1', () => resolve(server));
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
				return `http://127.0.0.1:${gatewayPort}/${cid}`;
			},
			peers() {
				return Promise.resolve(helia.libp2p.getConnections().map(p => p.remoteAddr.toString()));
			},
			id() {
				return helia.libp2p.peerId.toString();
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
	createRemote(url: string): Promise<IIpfsService> {
		return createRemoteIpfsService(url);
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
		contextBridge.exposeInMainWorld('nodeService', nodeService);
		contextBridge.exposeInMainWorld('configService', configService);
	} catch (error) {
		console.error(error);
	}
} else {
	// @ts-ignore (define in dts)
	window.configService = configService;
	// @ts-ignore (define in dts)
	window.nodeService = nodeService;
}
