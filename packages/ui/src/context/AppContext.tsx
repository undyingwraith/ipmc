import React, { useContext } from 'react';
import { Application, IApplication, IModule } from 'ipmc-core';
import { PropsWithChildren, createContext } from 'react';
import { useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { LoadScreen } from '../components/molecules/LoadScreen';
import { ThemeContextProvider } from './ThemeContext';

const AppContext = createContext({} as IApplication);

export function AppContextProvider(props: PropsWithChildren<{ setup: IModule; }>) {
	const application = useSignal<IApplication | undefined>(undefined);

	useSignalEffect(() => {
		const app = new Application();
		app.use(props.setup);
		application.value = app;
	});

	return (
		<ThemeContextProvider>
			{useComputed(() => (application.value !== undefined ? (
				<AppContext.Provider value={application.value}>
					{props.children}
				</AppContext.Provider>
			) : (
				<LoadScreen />
			)))}
		</ThemeContextProvider>
	);
}

export function useApp() {
	return useContext(AppContext);
}

export function useService<T>(identifier: symbol): T {
	const app = useApp();
	return app.getService<T>(identifier)!;
}

export function useOptionalService<T>(identifier: symbol): T | undefined {
	const app = useApp();
	try {
		return app.getService<T>(identifier)!;
	} catch (ex) {
		return undefined;
	}
}

