import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
//import { fileURLToPath } from 'url'

process.on('uncaughtException', function (error) {
	process.stdout.write(error.name + ': ' + error.message + '\n' + (error.stack != undefined ? error.stack + '\n' : ''));
});

function getAppPath(): string {
	return join(app.getPath('appData'), app.getName(), 'Data');
}

function createWindow(): void {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 900,
		height: 670,
		show: true,
		autoHideMenuBar: true,
		...(process.platform === 'linux' ? { icon } : {}),
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: join(__dirname, '../preload/index.mjs'),
			sandbox: false, // https://www.electronjs.org/docs/latest/tutorial/esm#summary-esm-support-matrix
		},
	});

	mainWindow.on('ready-to-show', () => {
		console.log('ready-to-show');
		mainWindow.show();
	});

	mainWindow.webContents.on('did-finish-load', () => {
		console.log('did-finish-load');
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: 'deny' };
	});

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
	} else {
		mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	ipcMain.handle('getAppPath', getAppPath);

	// Set app user model id for windows
	electronApp.setAppUserModelId('com.electron');

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	createWindow();

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
