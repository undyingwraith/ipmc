import { IConfigurationService, IProfile } from 'ipmc-interfaces';
import { getProfileFolder } from './utils';
import fso from 'fs';
import fs from 'fs/promises';
import path from 'path';

export class ConfigService implements IConfigurationService {
	constructor(ipcMain: Electron.IpcMain) {
		ipcMain.handle('config:getProfiles', this.getProfiles);
		ipcMain.handle('config:getProfile', (_, id) => this.getProfile(id));
		ipcMain.handle('config:setProfile', (_, id, profile) => this.setProfile(id, profile));
		ipcMain.handle('config:removeProfile', (_, id) => this.removeProfile(id));
	}

	async getProfiles(): Promise<string[]> {
		try {
			const folder = getProfileFolder();
			const profiles = (await fs.readdir(folder))
				.filter(p => fso.existsSync(path.join(folder, p, 'profile.json')));
			return profiles;
		} catch (_) {
			return [];
		}
	}

	async getProfile(id: string): Promise<IProfile> {
		return JSON.parse(await fs.readFile(path.join(getProfileFolder(id), '/profile.json'), 'utf-8'));
	}

	async setProfile(id: string, profile: IProfile) {
		const folder = getProfileFolder(id);
		if (!fso.existsSync(folder)) {
			await fs.mkdir(folder, {
				recursive: true
			});
		}
		await fs.writeFile(path.join(folder, '/profile.json'), JSON.stringify(profile));
	}

	async removeProfile(id) {
		return fs.rm(getProfileFolder(id), { recursive: true });
	}
}
