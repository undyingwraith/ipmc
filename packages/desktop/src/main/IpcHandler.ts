import { nativeTheme } from 'electron';
import { ConfigService } from './ipc/ConfigService';
import { NodeService } from './ipc/NodeService';

export function setupIpc(ipcMain: Electron.IpcMain) {
	new ConfigService(ipcMain);
	new NodeService(ipcMain);
	ipcMain.handle('shouldUseDarkColors', () => nativeTheme.shouldUseDarkColors);
}
