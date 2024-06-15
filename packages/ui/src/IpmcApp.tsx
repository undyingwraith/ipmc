import React from 'react';
import { LibraryManager } from "./components/pages/LibraryManager";
import { AppContextProvider } from './context/AppContext';
import { IProfileInit, ProfileContextProvider } from "./context/ProfileContext";
import { Route, Switch } from 'wouter';
import { BrowserModule, CoreModule } from 'ipmc-core';

// Setup translations
import './i18n';

export function IpmcApp(props: IProfileInit) {
	return (
		<AppContextProvider setup={(app) => {
			app.use(CoreModule);
			app.use(BrowserModule);
		}}>
			<ProfileContextProvider {...props}>
				<Switch>
					<Route path={'/'}>
						<LibraryManager />
					</Route>
					<Route>404: No such page!</Route>
				</Switch>
			</ProfileContextProvider>
		</AppContextProvider>
	);
}
