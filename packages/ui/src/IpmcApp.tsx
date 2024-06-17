import React from 'react';
import { LibraryManager } from "./components/pages/LibraryManager";
import { AppContextProvider } from './context/AppContext';
import { Route, Switch } from 'wouter';
import { BrowserModule, CoreModule, IModule } from 'ipmc-core';

// Setup translations
import './i18n';
import { AppBar } from './components/organisms/AppBar';

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
