import { BrowserModule, CoreModule, IModule } from 'ipmc-core';
import React from 'react';
import { Switch } from 'wouter';
import { AppBar } from './components/organisms/AppBar';
import { LibraryManager } from "./components/pages/LibraryManager";
import { AppContextProvider } from './context';
import { ITranslationsSymbol, ITranslation } from 'ipmc-interfaces';

// Setup translations
import './i18n';

export interface IIpmcAppProps {
	setup?: IModule;
}

// Translations
import en from './translations/en.json';
import de from './translations/de.json';

const resources = {
	en: {
		translation: en
	},
	de: {
		translation: de
	}
};

export function IpmcApp(props: IIpmcAppProps) {
	const { setup } = props;

	return (
		<AppContextProvider setup={(app) => {
			app.use(CoreModule);
			app.use(BrowserModule);
			app.registerConstantMultiple<ITranslation>(resources, ITranslationsSymbol);
			setup && app.use(setup);
		}}>
			<AppBar />
			<Switch>
				<LibraryManager />
			</Switch>
		</AppContextProvider>
	);
}
