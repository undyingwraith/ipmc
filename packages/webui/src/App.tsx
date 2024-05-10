import React from 'react';
import { IFileInfo, IpmcApp } from 'ipmc-core';

import { webSockets } from '@libp2p/websockets';
import { webTransport } from '@libp2p/webtransport';
import { preSharedKey } from "@libp2p/pnet";
import { noise } from "@chainsafe/libp2p-noise";
import { bootstrap } from '@libp2p/bootstrap';
import { peerIdFromString } from '@libp2p/peer-id';
import { bitswap, trustlessGateway } from '@helia/block-brokers';

import { CID } from 'multiformats';
import { IDBBlockstore } from 'blockstore-idb';
import { IDBDatastore } from 'datastore-idb';
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { create } from 'kubo-rpc-client';
import { ipns } from '@helia/ipns';

export function App() {
	return <IpmcApp
		configService={{
			getProfile(name) {
				const value = window.localStorage.getItem('profile_' + name);
				return value ? JSON.parse(value) : undefined;
			},
			getProfiles() {
				const value = window.localStorage.getItem('profiles');
				return value ? JSON.parse(value) : [];
			},
			setProfile(name, profile) {
				window.localStorage.setItem('profile_' + name, JSON.stringify(profile));
				const value = window.localStorage.getItem('profiles');
				const profiles: string[] = value ? JSON.parse(value) : [];
				if (!profiles.some(p => p == name)) {
					window.localStorage.setItem('profiles', JSON.stringify([...profiles, name]));
				}
			},
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
						...(profile?.swarmKey ? {
							connectionProtector: preSharedKey({
								psk: new TextEncoder().encode(profile.swarmKey),
							}),
						} : {}),
						transports: [
							webSockets(),
							webTransport(),
						],
						peerDiscovery: [
							bootstrap({
								list: profile?.bootstrap ?? [
									// a list of bootstrap peer multiaddrs to connect to on node startup
									'/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
									'/dnsaddr/bootstrap.libp2p.io/ipfs/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
									'/dnsaddr/bootstrap.libp2p.io/ipfs/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa'
								]
							})
						],
						connectionEncryption: [noise()],
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
					toUrl(cid: string) {
						return `TODO ${cid}`;
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
			async createRemote(url) {
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
					peers() {
						return node.swarm.peers().then(r => r.map(p => p.addr.toString()));
					},
					async resolve(name) {
						let result = '';
						for await (const res of node.name.resolve(name)) {
							result = res;
						}

						return result;
					},
				};
			},
		}}
	/>;
};
