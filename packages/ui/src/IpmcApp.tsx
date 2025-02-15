import { Box, CssBaseline } from '@mui/material';
import { BrowserModule, CoreModule, FileExportService, IModule } from 'ipmc-core';
import { IConfigurationService, IConfigurationServiceSymbol, IFileExportServiceSymbol, INodeService, ITranslation, ITranslationsSymbol } from 'ipmc-interfaces';
import { Router, Switch } from 'wouter-preact';
import { useHashLocation } from 'wouter-preact/use-hash-location';
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
		<Router hook={useHashLocation}>
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
		</Router>
	);
}
