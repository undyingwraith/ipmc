import { BrowserModule, CoreModule, IModule } from 'ipmc-core';
import React from 'react';
import { Switch } from 'wouter';
import { AppBar } from './components/organisms/AppBar';
import { LibraryManager } from "./components/pages/LibraryManager";
import { AppContextProvider } from './context';

// Setup translations
import './i18n';

export interface IIpmcAppProps {
	setup?: IModule;
}

export function IpmcApp(props: IIpmcAppProps) {
	const { setup } = props;

	return (
		<AppContextProvider setup={(app) => {
			app.use(CoreModule);
			app.use(BrowserModule);
			setup && app.use(setup);
		}}>
			<AppBar />
			<Switch>
				<LibraryManager />
			</Switch>
		</AppContextProvider>
	);
}
