import { Box, CssBaseline } from '@mui/material';
import { BrowserModule, CoreModule, FileExportService, IModule } from 'ipmc-core';
import { IConfigurationService, IConfigurationServiceSymbol, IFileExportServiceSymbol, INodeService, ITranslation, ITranslationsSymbol } from 'ipmc-interfaces';
import React from 'react';
import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { AppBar } from './components/organisms/AppBar';
import { AppContextProvider, ThemeProvider } from './context';
import { IpmcLauncher } from './IpmcLauncher';
import { UiModule } from './services/UiModule';
import translations from './translations';

export interface IIpmcAppProps {
	setup?: IModule;
	configService: IConfigurationService;
	nodeService: INodeService;
}

export function IpmcApp(props: IIpmcAppProps) {
	const { setup } = props;

	return (
		<Router hook={(options?: { ssrPath: string; }) => {
			const [path, navigate] = useHashLocation(options);
			return [decodeURIComponent(path), (url) => navigate(encodeURIComponent(url).replaceAll('%2F', '/'))];
		}}>
			<AppContextProvider setup={(app) => {
				app.use(CoreModule);
				app.use(BrowserModule);
				app.use(UiModule);
				app.registerConstant(props.configService, IConfigurationServiceSymbol);
				app.register(FileExportService, IFileExportServiceSymbol);
				app.registerConstantMultiple<ITranslation>(translations, ITranslationsSymbol);
				setup && app.use(setup);
			}}>
				<ThemeProvider>
					<CssBaseline />
					<Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
						<AppBar />
						<Box sx={{ overflow: 'auto', flexGrow: 1 }}>
							<IpmcLauncher configService={props.configService} nodeService={props.nodeService} />
						</Box>
					</Box>
				</ThemeProvider>
			</AppContextProvider>
		</Router>
	);
}
