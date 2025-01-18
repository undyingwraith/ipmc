import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from '@chainsafe/libp2p-yamux';
import { bitswap, trustlessGateway } from '@helia/block-brokers';
import { ipns } from '@helia/ipns';
import { unixfs } from '@helia/unixfs';
import { autoNAT } from '@libp2p/autonat';
import { bootstrap } from '@libp2p/bootstrap';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { dcutr } from '@libp2p/dcutr';
import { identify, identifyPush } from '@libp2p/identify';
import { kadDHT } from '@libp2p/kad-dht';
import { keychain } from '@libp2p/keychain';
import { mplex } from '@libp2p/mplex';
import { peerIdFromString } from '@libp2p/peer-id';
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
import { Defaults } from 'ipmc-core';
import { IFileInfo } from 'ipmc-interfaces';
import { IpmcApp } from 'ipmc-ui';
import { ipnsSelector } from 'ipns/selector';
import { ipnsValidator } from 'ipns/validator';
import { CID } from 'multiformats';
import React from 'react';
import { concat } from 'uint8arrays';

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
					return value ? Object.keys(JSON.parse(value)) : [];
				},
				setProfile(id, profile) {
					const profilesString = window.localStorage.getItem('profiles');
					const profiles = profilesString ? JSON.parse(profilesString) : {};
					profiles[id] = profile;

					window.localStorage.setItem('profiles', JSON.stringify(profiles));
				},
				removeProfile(id: string) {
					const profilesString = window.localStorage.getItem('profiles');
					const profiles = profilesString ? JSON.parse(profilesString) : {};
					delete profiles[id];

					window.localStorage.setItem('profiles', JSON.stringify(profiles));
				}
			}}
			nodeService={{
				async create(profile) {
					const datastore = new IDBDatastore(`${profile?.name ?? 'default'}/data`);
					await datastore.open();
					const blockstore = new IDBBlockstore(`${profile?.name ?? 'default'}/data`);
					await blockstore.open();

					const helia = await createHelia({
						start: true,
						datastore,
						blockstore,
						libp2p: {
							addresses: {
								listen: [
									'/ws',
									'/wss',
									'/webrtc',
								],
							},
							...(profile?.swarmKey ? {
								connectionProtector: preSharedKey({
									psk: new TextEncoder().encode(profile.swarmKey),
								}),
							} : {}),
							transports: [
								circuitRelayTransport({
									discoverRelays: 1
								}),
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
								mplex()
							],
							connectionEncryption: [noise()],
							services: {
								dht: kadDHT({
									validators: {
										ipns: ipnsValidator
									},
									selectors: {
										ipns: ipnsSelector
									}
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
				},
			}}
		/>
	);
};
