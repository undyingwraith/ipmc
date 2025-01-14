import { BrowserModule, CoreModule, IModule } from 'ipmc-core';
import React from 'react';
import { Switch } from 'wouter';
import { AppBar } from './components/organisms/AppBar';
import { LibraryManager } from "./components/pages/LibraryManager";
import { AppContextProvider } from './context';
import { ITranslationsSymbol, ITranslation } from 'ipmc-interfaces';
import translations from './translations';

export interface IIpmcAppProps {
	setup?: IModule;
}

export function IpmcApp(props: IIpmcAppProps) {
	const { setup } = props;

	return (
		<AppContextProvider setup={(app) => {
			app.use(CoreModule);
			app.use(BrowserModule);
			app.registerConstantMultiple<ITranslation>(translations, ITranslationsSymbol);
			setup && app.use(setup);
		}}>
			<AppBar />
			<Switch>
				<LibraryManager />
			</Switch>
		</AppContextProvider>
	);
}
