import { contextBridge, ipcRenderer } from 'electron';
import { IConfigurationService, IIpfsService, INodeService, IProfile } from 'ipmc-interfaces';

const nodeService: INodeService = {
	async create(profile): Promise<IIpfsService> {
		await ipcRenderer.invoke('node:create', profile);
		const id: string = await ipcRenderer.invoke('ipfs:id');
		return {
			isPinned: (cid) => ipcRenderer.invoke('ipfs:isPinned', cid),
			addPin: (cid: string) => ipcRenderer.invoke('ipfs:addPin', cid),
			rmPin: (cid: string) => ipcRenderer.invoke('ipfs:rmPin', cid),
			ls: (cid: string, signal?: AbortSignal) => ipcRenderer.invoke('ipfs:ls', cid, signal),
			peers: () => ipcRenderer.invoke('ipfs:peers'),
			stop: () => ipcRenderer.invoke('ipfs:stop'),
			resolve: (ipns) => ipcRenderer.invoke('ipfs:resolve', ipns),
			id: () => id,
			fetch: (cid: string, path?: string) => ipcRenderer.invoke('ipfs:fetch', cid, path),
		};
	},
};

const configService: IConfigurationService = {
	async getProfiles(): Promise<string[]> {
		return ipcRenderer.invoke('config:getProfiles');
	},
	async getProfile(id: string): Promise<IProfile> {
		return ipcRenderer.invoke('config:getProfile', id);
	},
	async setProfile(id: string, profile: IProfile) {
		return ipcRenderer.invoke('config:setProfile', id, profile);
	},
	async removeProfile(id) {
		return ipcRenderer.invoke('config:removeProfile', id);
	},
};

const themeService = {
	shouldUseDarkColors: () => ipcRenderer.invoke('shouldUseDarkColors')
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld('nodeService', nodeService);
		contextBridge.exposeInMainWorld('configService', configService);
		contextBridge.exposeInMainWorld('themeService', themeService);
	} catch (error) {
		console.error(error);
	}
} else {
	// @ts-ignore
	window.configService = configService;
	// @ts-ignore
	window.nodeService = nodeService;
	// @ts-ignore
	window.themeService = themeService;
}
