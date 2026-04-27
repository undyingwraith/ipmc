import { app } from 'electron';
import { join } from 'path';

export function getProfileFolder(id?: string) {
	const appPath = join(app.getPath('appData'), app.getName(), 'Data');
	const profilesPath = join(appPath, 'profiles');
	return id ? join(profilesPath, id) : profilesPath;
}
