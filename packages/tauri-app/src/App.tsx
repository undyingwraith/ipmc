import { invoke } from '@tauri-apps/api/core';
import { IConfigurationService, IIpfsService, INodeService } from 'ipmc-interfaces';
import { IpmcApp } from "ipmc-ui";

const configService: IConfigurationService = {
	getProfile: (id) => invoke('get_profile', { id }),
	getProfiles: () => invoke('get_profiles'),
	removeProfile: (id) => invoke('remove_profile', { id }),
	setProfile: (id, profile) => invoke('set_profile', { id, profile })
};

const nodeService: INodeService = {
	create: async (profile) => {
		await invoke('create_node', { profile });

		await new Promise(resolve => setTimeout(resolve, 5000));

		const id = profile.id;
		const node_id: string = await invoke('ipfs_id', { id });
		const api: IIpfsService = {
			addPin: (cid) => invoke('ipfs_add_pin', { cid, id }),
			fetch: async (cid, path) => (await invoke('ipfs_fetch', { cid, id, path: path ?? '/' })) as Uint8Array<ArrayBuffer>,
			id: () => node_id,
			isPinned: (cid) => invoke('ipfs_is_pinned', { cid, id }),
			ls: (cid, _) => invoke('ipfs_ls', { cid, id }),
			peers: () => invoke('ipfs_peers', { id }),
			resolve: (ipns) => invoke('ipfs_resolve', { ipns, id }),
			rmPin: (cid) => invoke('ipfs_rm_pin', { cid, id }),
			stop: () => invoke('ipfs_stop', { id }),
		};
		return api;
	}
};

function App() {
	return (
		<IpmcApp
			configService={configService}
			nodeService={nodeService}
		/>
	);
}

export default App;
