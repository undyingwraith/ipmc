import { app } from 'electron';
import { join } from 'path';
import { ConfigService } from './ipc/ConfigService';

function getAppPath(): string {
	return join(app.getPath('appData'), app.getName(), 'Data');
}

export function setupIpc(ipcMain: Electron.IpcMain) {
	new ConfigService(ipcMain);
	ipcMain.handle('getAppPath', getAppPath);
}
