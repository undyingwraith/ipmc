import { invoke } from '@tauri-apps/api/core';
import { BrowserModule, CoreModule } from 'ipmc-core';
import { IConfigurationService, IIpfsService, INodeService } from 'ipmc-interfaces';
import { IpmcApp, IpmcLauncher } from "ipmc-ui";
import { useEffect, useState } from 'react';
import { Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

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
			fetch: (cid, path) => invoke('ipfs_fetch', { cid, path, id }),
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
		<Router>
			<Switch>
				<Route path="/launcher">
					{() => <IpmcApp configService={configService} nodeService={nodeService} />}
					{/*() => <Router hook={(options?: { ssrPath: string; }) => {
						const [path, navigate] = useHashLocation(options);
						return [decodeURIComponent(path), (url) => navigate(encodeURIComponent(url).replaceAll('%2F', '/'))];
					}}>
						<AppContextProvider setup={(app) => {
							app.use(CoreModule);
							app.use(BrowserModule);
							app.use(UiCoreModule);
							app.registerConstant(configService, IConfigurationServiceSymbol);
							app.register(FileExportService, IFileExportServiceSymbol);
							app.registerConstantMultiple<ITranslation>(translations, ITranslationsSymbol);
						}}>
							<ThemeProvider>
								<CssBaseline />
								<Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
									<AppBar />
									<Box sx={{ overflow: 'auto', flexGrow: 1 }}>
										<IpmcLauncher configService={configService} nodeService={nodeService} />
									</Box>
								</Box>
							</ThemeProvider>
						</AppContextProvider>
					</Router>*/}
				</Route>
				{/*<Route path="/">
					{() => (
						<AppContextProvider setup={(app) => {
							app.registerConstant(stop, StopFunctionSymbol);
							app.registerConstant<IIpfsService>(ipfs!, IIpfsServiceSymbol);
							app.registerConstant<IProfile>(currentProfile!, IProfileSymbol);
							app.use(ProfileModule);
							app.use(UiModule);
						}} >
							<LibraryManager />
						</AppContextProvider>
					)}
				</Route>*/}
			</Switch>
		</Router >);
}

export default App;
