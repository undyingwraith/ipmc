import { invoke } from '@tauri-apps/api/core';
import { BrowserModule, CoreModule } from 'ipmc-core';
import { IConfigurationService, INodeService } from 'ipmc-interfaces';
import { AppContextProvider, IpmcApp, IpmcLauncher } from "ipmc-ui";
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
	create: (profile) => invoke('create_node', { profile })
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
