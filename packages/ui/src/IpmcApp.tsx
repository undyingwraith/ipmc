import React from 'react';
import { LibraryManager } from "./components/pages/LibraryManager";
import { Route, Switch } from 'wouter';
import { BrowserModule, CoreModule, IModule } from 'ipmc-core';
import { AppBar } from './components/organisms/AppBar';
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
				<Route path={'/'}>
					<LibraryManager />
				</Route>
				<Route>404: No such page!</Route>
			</Switch>
		</AppContextProvider>
	);
}
