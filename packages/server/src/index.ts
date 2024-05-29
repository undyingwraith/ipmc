import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { mplex } from '@libp2p/mplex';
import { bitswap, trustlessGateway } from '@helia/block-brokers';
import { bootstrap } from '@libp2p/bootstrap';
import { circuitRelayServer, circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { preSharedKey } from '@libp2p/pnet';
import { tcp } from '@libp2p/tcp';
import { webSockets } from '@libp2p/websockets';
import { kadDHT, removePrivateAddressesMapper } from '@libp2p/kad-dht';
import { FsBlockstore } from 'blockstore-fs';
import { LevelDatastore } from 'datastore-level';
import fs from 'fs';
import { createHelia } from 'helia';
import { mdns } from '@libp2p/mdns';
import { identify, identifyPush } from '@libp2p/identify';
import { keychain } from '@libp2p/keychain';
import { ping } from '@libp2p/ping';
import { dcutr } from '@libp2p/dcutr';
import { autoNAT } from '@libp2p/autonat';
import { ipnsSelector } from 'ipns/selector';
import { ipnsValidator } from 'ipns/validator';
import * as libp2pInfo from 'libp2p/version';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';
import { CID } from 'multiformats';


function getProfileFolder(name: string): string {
	return `./profiles/${name}`;
}

const name = process.argv[2];
const pinItems = false;
const profile = JSON.parse(fs.readFileSync(getProfileFolder(name) + '/profile.json', 'utf-8'));

const datastore = new LevelDatastore(`${getProfileFolder(profile.name)}/data`);
await datastore.open();
const blockstore = new FsBlockstore(`${getProfileFolder(profile.name)}/blocks`);
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

if (pinItems) {
	Promise.all(profile.libraries.map(async lib => {
		for await (const block of helia.pins.add(CID.parse(lib.root))) {
			console.log(`${lib.name} pin progress: ${block.toString()}`);
		}
		console.log(`${lib.name} pinned!`);
	})).then(() => {
		console.log('All libraries pinned!');
	});
}
