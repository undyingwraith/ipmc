import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { noise } from '@chainsafe/libp2p-noise';
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
import { mplex } from '@libp2p/mplex';
import { ping } from '@libp2p/ping';
import { preSharedKey } from '@libp2p/pnet';
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';
import { tcp } from '@libp2p/tcp';
import { webSockets } from '@libp2p/websockets';
import { FsBlockstore } from 'blockstore-fs';
import { LevelDatastore } from 'datastore-level';
import { createHelia } from 'helia';
import { createHeliaIpfs, Defaults } from 'ipmc-core';
import type { IIpfsService } from 'ipmc-interfaces';
import * as libp2pInfo from 'libp2p/version';
import type { IServerProfile } from './IServerProfile';
import { DefaultServerProfile } from './DefaultServerProfile';

export async function createNode(profile: IServerProfile): Promise<IIpfsService> {
	const datastore = new LevelDatastore(profile.dataDir ?? DefaultServerProfile.dataDir!);
	await datastore.open();
	const blockstore = new FsBlockstore(profile.blocksDir ?? DefaultServerProfile.blocksDir!);
	await blockstore.open();

	const agentVersion = `ipmc/1.0.0 ${libp2pInfo.name}/${libp2pInfo.version} UserAgent=${globalThis.navigator.userAgent}`;
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
					list: profile.bootstrap ?? (profile.swarmKey != undefined ? [] : Defaults.Bootstrap),
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
				identify: identify({ agentVersion }),
				identifyPush: identifyPush({ agentVersion }),
				keychain: keychain(),
				ping: ping(),
				autoNAT: autoNAT(),
				dcutr: dcutr(),
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

	// Log adresses
	console.log(helia.libp2p.getMultiaddrs().map(a => a.toString()));

	return createHeliaIpfs(helia, async () => {
		await blockstore.close();
		await datastore.close();
	});;
}
