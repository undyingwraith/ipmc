import { useComputed, useSignal, useSignalEffect } from '@preact/signals';
import { Application, IApplication, IModule } from 'ipmc-core';
import { ComponentChildren, createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { LoadScreen } from '../components/molecules/LoadScreen';

export const AppContext = createContext<Application | undefined>(undefined);

export function AppContextProvider(props: {
	setup: IModule;
	children: ComponentChildren;
}) {
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

