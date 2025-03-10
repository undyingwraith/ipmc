import { useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { Application, IApplication, IModule } from 'ipmc-core';
import React, { PropsWithChildren, createContext, useContext } from 'react';
import { LoadScreen } from '../components/molecules/LoadScreen';

export const AppContext = createContext<Application | undefined>(undefined);

export function AppContextProvider(props: PropsWithChildren<{ setup: IModule; }>) {
	const application = useSignal<Application | undefined>(undefined);
	const parentApp = useContext(AppContext);

	useSignalEffect(() => {
		const app = parentApp?.createChildApplication() ?? new Application();
		app.use(props.setup);
		application.value = app;
	});

	return useComputed(() => (application.value !== undefined ? (
		<AppContext.Provider value={application.value}>
			{props.children}
		</AppContext.Provider>
	) : (
		<LoadScreen />
	)));
}

export function useApp(): IApplication {
	return useContext(AppContext)!;
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

