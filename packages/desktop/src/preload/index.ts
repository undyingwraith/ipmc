import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { noise, pureJsCrypto } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { bitswap, trustlessGateway } from '@helia/block-brokers';
import { ipns } from '@helia/ipns';
import { unixfs } from '@helia/unixfs';
import { autoNAT } from '@libp2p/autonat';
import { bootstrap } from '@libp2p/bootstrap';
import { circuitRelayServer, circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { dcutr } from '@libp2p/dcutr';
import { identify, identifyPush } from '@libp2p/identify';
import { kadDHT, removePrivateAddressesMapper } from '@libp2p/kad-dht';
import { keychain } from '@libp2p/keychain';
import { mdns } from '@libp2p/mdns';
import { mplex } from '@libp2p/mplex';
import { peerIdFromString } from '@libp2p/peer-id';
import { ping } from '@libp2p/ping';
import { preSharedKey } from '@libp2p/pnet';
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';
import { tcp } from '@libp2p/tcp';
import { uPnPNAT } from '@libp2p/upnp-nat';
import { webSockets } from '@libp2p/websockets';
import { FsBlockstore } from 'blockstore-fs';
import { LevelDatastore } from 'datastore-level';
import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';
import { createHelia } from 'helia';
import { IConfigurationService, IFileInfo, IInternalProfile, IIpfsService, INodeService, IProfile } from 'ipmc-interfaces';
import { ipnsSelector } from 'ipns/selector';
import { ipnsValidator } from 'ipns/validator';
import * as libp2pInfo from 'libp2p/version';
import { CID } from 'multiformats';
import path from 'path';
import { concat } from 'uint8arrays';

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
				addresses: {
					listen: [
						`/ip4/0.0.0.0/tcp/${profile.port ?? 0}`,
						`/ip6/::/tcp/${profile.port ?? 0}`,
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
							//TODO: replace with Defaults from core module
							'/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
							'/dnsaddr/bootstrap.libp2p.io/ipfs/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
							'/dnsaddr/bootstrap.libp2p.io/ipfs/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
						]),
					}),
					pubsubPeerDiscovery(),
					mdns(),
				],
				connectionEncryption: [
					noise({
						crypto: pureJsCrypto
					}),
				],
				streamMuxers: [
					yamux(),
					mplex(),
				],
				services: {
					relay: circuitRelayServer({
						advertise: true,
					}),
					dht: kadDHT({
						peerInfoMapper: removePrivateAddressesMapper,
						validators: {
							ipns: ipnsValidator
						},
						selectors: {
							ipns: ipnsSelector
						}
					}),
					identify: identify({ agentVersion }),
					identifyPush: identifyPush({ agentVersion }),
					keychain: keychain(),
					ping: ping(),
					autoNAT: autoNAT(),
					dcutr: dcutr(),
					upnp: uPnPNAT(),
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

		const fs = unixfs(helia);

		const service = ({
			async ls(cid: string, signal) {
				const files: IFileInfo[] = [];
				for await (const file of fs.ls(CID.parse(cid), {
					signal
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
				await blockstore.close();
				await datastore.close();
				nodes.delete(profile.id);
			},
			peers() {
				return Promise.resolve([...new Set(helia.libp2p.getConnections().map(p => p.remoteAddr.toString()))]);
			},
			id() {
				return helia.libp2p.peerId.toString();
			},
			async resolve(name) {
				try {
					return (await ipns(helia).resolve(peerIdFromString(name))).cid.toString();
				} catch (ex) {
					console.error(ex);
					return (await ipns(helia).resolveDNSLink(name)).cid.toString();
				}
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
	// @ts-ignore (define in dts)
	window.configService = configService;
	// @ts-ignore (define in dts)
	window.nodeService = nodeService;
}
