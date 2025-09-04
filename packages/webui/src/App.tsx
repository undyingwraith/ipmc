import 'reflect-metadata';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from '@chainsafe/libp2p-yamux';
import { bitswap, trustlessGateway } from '@helia/block-brokers';
import { autoNAT } from '@libp2p/autonat';
import { bootstrap } from '@libp2p/bootstrap';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { dcutr } from '@libp2p/dcutr';
import { identify, identifyPush } from '@libp2p/identify';
import { kadDHT, removePrivateAddressesMapper, removePublicAddressesMapper } from '@libp2p/kad-dht';
import { keychain } from '@libp2p/keychain';
import { ping } from '@libp2p/ping';
import { preSharedKey } from "@libp2p/pnet";
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';
import { webRTC, webRTCDirect } from '@libp2p/webrtc';
import { webSockets } from '@libp2p/websockets';
import { all } from '@libp2p/websockets/filters';
import { webTransport } from '@libp2p/webtransport';
import { IDBBlockstore } from 'blockstore-idb';
import { IDBDatastore } from 'datastore-idb';
import { createHelia } from 'helia';
import { createHeliaIpfs, Defaults } from 'ipmc-core';
import { IpmcApp } from 'ipmc-ui';
import React from 'react';

export function App() {
	return (
		<IpmcApp
			configService={{
				getProfile(id) {
					const value = window.localStorage.getItem('profiles');
					if (value) {
						const profiles = JSON.parse(value);
						if (Object.hasOwn(profiles, id)) {
							return profiles[id];
						}
					}
					return undefined;
				},
				getProfiles() {
					const value = window.localStorage.getItem('profiles');
					return Promise.resolve(value ? Object.keys(JSON.parse(value)) : []);
				},
				setProfile(id, profile) {
					const profilesString = window.localStorage.getItem('profiles');
					const profiles = profilesString ? JSON.parse(profilesString) : {};
					profiles[id] = profile;

					window.localStorage.setItem('profiles', JSON.stringify(profiles));

					return Promise.resolve();
				},
				removeProfile(id: string) {
					const profilesString = window.localStorage.getItem('profiles');
					const profiles = profilesString ? JSON.parse(profilesString) : {};
					delete profiles[id];

					window.localStorage.setItem('profiles', JSON.stringify(profiles));

					return Promise.resolve();
				}
			}}
			nodeService={{
				async create(profile) {
					const datastore = new IDBDatastore(`${profile?.name ?? 'default'}/data`);
					await datastore.open();
					const blockstore = new IDBBlockstore(`${profile?.name ?? 'default'}/blocks`);
					await blockstore.open();

					const helia = await createHelia({
						start: true,
						datastore,
						blockstore,
						libp2p: {
							addresses: {
								listen: [
									'/p2p-circuit',
									'/webrtc',
								],
							},
							...(profile?.swarmKey ? {
								connectionProtector: preSharedKey({
									psk: new TextEncoder().encode(profile.swarmKey),
								}),
							} : {}),
							transports: [
								circuitRelayTransport(),
								webRTC(),
								webRTCDirect(),
								webTransport(),
								webSockets({
									filter: all
								}),
							],
							peerDiscovery: [
								bootstrap({
									list: profile?.bootstrap ?? Defaults.Bootstrap
								}),
								pubsubPeerDiscovery(),
							],
							streamMuxers: [
								yamux(),
							],
							connectionEncrypters: [noise()],
							services: {
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
								pubsub: gossipsub({
									allowPublishToZeroTopicPeers: true,
									canRelayMessage: true,
								}),
							},
						},
						blockBrokers: [
							bitswap(),
							...(profile?.swarmKey == undefined ? [trustlessGateway()] : [])
						],
					});

					console.log(helia.libp2p.getMultiaddrs().map(a => a.toString()));

					return createHeliaIpfs(helia, async () => {
						await blockstore.close();
						await datastore.close();
					});
				},
			}}
		/>
	);
};
