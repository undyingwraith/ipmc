import { BrowserModule, CoreModule, FileExportService, IModule } from 'ipmc-core';
import { IConfigurationService, IConfigurationServiceSymbol, IFileExportServiceSymbol, INodeService, ITranslation, ITranslationsSymbol } from 'ipmc-interfaces';
import React from 'react';
import { Switch } from 'wouter';
import { AppBar } from './components/organisms/AppBar';
import { AppContextProvider, ThemeProvider } from './context';
import { UiModule } from './services/UiModule';
import translations from './translations';
import { IpmcLauncher } from './IpmcLauncher';
import { Box, CssBaseline } from '@mui/material';

export interface IIpmcAppProps {
	setup?: IModule;
	configService: IConfigurationService;
	nodeService: INodeService;
}

export function IpmcApp(props: IIpmcAppProps) {
	const { setup } = props;

	return (
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
						<Switch>
							<IpmcLauncher configService={props.configService} nodeService={props.nodeService} />
						</Switch>
					</Box>
				</Box>
			</ThemeProvider>
		</AppContextProvider>
	);
}
