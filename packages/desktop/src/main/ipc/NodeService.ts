import { IInternalProfile, IIpfsService } from 'ipmc-interfaces';
import { getProfileFolder } from './utils';

export class NodeService {
	constructor(ipcMain: Electron.IpcMain) {
		ipcMain.handle('node:create', (_, profile) => this.create(profile));
		ipcMain.handle('ipfs:isPinned', (_, cid) => this.node ? this.node.isPinned(cid) : Promise.reject());
		ipcMain.handle('ipfs:addPin', (_, cid) => this.node ? this.node.addPin(cid) : Promise.reject());
		ipcMain.handle('ipfs:rmPin', (_, cid) => this.node ? this.node.rmPin(cid) : Promise.reject());
		ipcMain.handle('ipfs:ls', (_, cid) => this.node ? this.node.ls(cid) : Promise.reject());
		ipcMain.handle('ipfs:peers', (_) => this.node ? this.node.peers() : Promise.reject());
		ipcMain.handle('ipfs:stop', (_) => this.stop());
		ipcMain.handle('ipfs:resolve', (_, ipns) => this.node ? this.node.resolve(ipns) : Promise.reject());
		ipcMain.handle('ipfs:id', (_) => this.node ? this.node.id() : Promise.reject());
		ipcMain.handle('ipfs:fetch', (_, cid, path) => this.node ? this.node.fetch(cid, path) : Promise.reject());
	}

	async stop(): Promise<void> {
		if (this.node) {
			await this.node.stop();
			this.node = undefined;
		} else {
			return Promise.reject();
		}
	}

	async create(profile: IInternalProfile): Promise<void> {
		if (this.node) {
			return;
		}

		const folder = getProfileFolder(profile.id);
		const { createNode } = await import('./createNode.mjs');

		const service = await createNode(profile, folder);

		this.node = service;
	}

	private node: IIpfsService | undefined;
}
