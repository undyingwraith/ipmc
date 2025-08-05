import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { noise, pureJsCrypto } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { bitswap, trustlessGateway } from '@helia/block-brokers';
import { autoNAT } from '@libp2p/autonat';
import { bootstrap } from '@libp2p/bootstrap';
import { circuitRelayServer, circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { dcutr } from '@libp2p/dcutr';
import { identify, identifyPush } from '@libp2p/identify';
import { kadDHT, removePrivateAddressesMapper, removePublicAddressesMapper } from '@libp2p/kad-dht';
import { keychain } from '@libp2p/keychain';
import { mdns } from '@libp2p/mdns';
import { ping } from '@libp2p/ping';
import { preSharedKey } from '@libp2p/pnet';
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';
import { tcp } from '@libp2p/tcp';
import { uPnPNAT } from '@libp2p/upnp-nat';
import { webRTC, webRTCDirect } from '@libp2p/webrtc';
import { webSockets } from '@libp2p/websockets';
import { FsBlockstore } from 'blockstore-fs';
import { LevelDatastore } from 'datastore-level';
import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';
import { createHelia } from 'helia';
import { createHeliaIpfs, Defaults } from 'ipmc-core';
import { IConfigurationService, IInternalProfile, IIpfsService, INodeService, IProfile } from 'ipmc-interfaces';
import * as libp2pInfo from 'libp2p/version';
import path from 'path';

async function getProfileFolder(id?: string): Promise<string> {
	const appPath = path.join(await ipcRenderer.invoke('getAppPath'), 'profiles');
	return id ? path.join(appPath, id) : appPath;
}

const nodes = new Map<string, IIpfsService>();

const nodeService: INodeService = {
	async create(profile: IInternalProfile): Promise<IIpfsService> {
		if (nodes.has(profile.id)) {
			return nodes.get(profile.id)!;
		}

		const folder = await getProfileFolder(profile.id);

		const agentVersion = `helia/2.0.0 ${libp2pInfo.name}/${libp2pInfo.version} UserAgent=${process.version}`;
		const datastore = new LevelDatastore(path.join(folder, 'data'));
		await datastore.open();
		const blockstore = new FsBlockstore(path.join(folder, 'blocks'));
		await blockstore.open();

		const helia = await createHelia({
			start: true,
			datastore,
			blockstore,
			libp2p: {
				nodeInfo: {
					userAgent: agentVersion
				},
				addresses: {
					listen: [
						`/ip4/0.0.0.0/tcp/${profile.port ?? 0}`,
						`/ip6/::/tcp/${profile.port ?? 0}`,
						`/ip4/0.0.0.0/udp/${profile.port ?? 0}/quic-v1`,
						`/ip6/::/udp/${profile.port ?? 0}/quic-v1`,
						`/ip4/0.0.0.0/udp/${profile.port ?? 0}/webrtc-direct`,
						`/ip6/::/udp/${profile.port ?? 0}/webrtc-direct`,
						'/ip4/0.0.0.0/tcp/0/ws',
						'/ip6/::/tcp/0/ws',
						'/p2p-circuit',
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
					circuitRelayTransport(),
					webRTC(),
					webRTCDirect(),
				],
				peerDiscovery: [
					bootstrap({
						list: profile.bootstrap ?? (profile.swarmKey != undefined ? [] : Defaults.Bootstrap),
					}),
					pubsubPeerDiscovery(),
					mdns(),
				],
				connectionEncrypters: [
					noise({
						crypto: pureJsCrypto
					}),
				],
				streamMuxers: [
					yamux(),
				],
				services: {
					relay: circuitRelayServer(),
					lanDHT: kadDHT({
						protocol: '/ipfs/lan/kad/1.0.0',
						peerInfoMapper: removePublicAddressesMapper,
						clientMode: false,
						logPrefix: 'libp2p:dht-lan',
						datastorePrefix: '/dht-lan',
						metricsPrefix: 'libp2p_dht_lan'
					}),
					aminoDHT: kadDHT({
						protocol: '/ipfs/kad/1.0.0',
						peerInfoMapper: removePrivateAddressesMapper,
						logPrefix: 'libp2p:dht-amino',
						datastorePrefix: '/dht-amino',
						metricsPrefix: 'libp2p_dht_amino'
					}),
					identify: identify(),
					identifyPush: identifyPush(),
					keychain: keychain(),
					ping: ping(),
					autoNAT: autoNAT(),
					dcutr: dcutr(),
					upnp: uPnPNAT(),
					pubsub: gossipsub({
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
		helia.libp2p.addEventListener('peer:discovery', console.log);
		helia.libp2p.addEventListener('peer:connect', console.log);

		const service = createHeliaIpfs(helia, async () => {
			await blockstore.close();
			await datastore.close();
			nodes.delete(profile.id);
		});

		nodes.set(profile.id, service);

		return service;
	},
};

const configService: IConfigurationService = {
	async getProfiles(): Promise<string[]> {
		try {
			const profiles = fs.readdirSync(await getProfileFolder());
			return profiles;
		} catch (_) {
			return [];
		}
	},
	async getProfile(id: string): Promise<IProfile> {
		return JSON.parse(fs.readFileSync(path.join(await getProfileFolder(id), '/profile.json'), 'utf-8'));
	},
	async setProfile(id: string, profile: IProfile) {
		const folder = await getProfileFolder(id);
		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder, {
				recursive: true
			});
		}
		fs.writeFileSync(path.join(folder, '/profile.json'), JSON.stringify(profile));
	},
	async removeProfile(id) {
		fs.rmSync(await getProfileFolder(id), { recursive: true });
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
	// @ts-ignore
	window.configService = configService;
	// @ts-ignore
	window.nodeService = nodeService;
}
