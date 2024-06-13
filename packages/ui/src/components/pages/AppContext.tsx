import React, { useContext } from 'react';
import { Application, IApplication } from 'ipmc-core';
import { PropsWithChildren, createContext } from 'react';
import { useSignal, useSignalEffect } from '@preact/signals-react';

const AppContext = createContext({} as IApplication);

export function AppContextProvider(props: PropsWithChildren<{ setup: (app: IApplication) => void; }>) {
	const app = useSignal<IApplication>(new Application());

	useSignalEffect(() => {
		app.value.use(props.setup);
	});

	return (
		<AppContext.Provider value={app.value}>
			{props.children}
		</AppContext.Provider>
	);
}


export function useApp() {
	return useContext(AppContext);
}

export function useService<T>(identifier: symbol) {
	return useApp().getService<T>(identifier);
}
