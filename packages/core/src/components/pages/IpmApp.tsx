import { AppContextProvider, IAppInit } from "./AppContext";
import React from 'react'
import { LibraryManager } from "./LibraryManager";

// Setup translations
import '../../i18n';

export function IpmApp(props: IAppInit) {
	return (
		<AppContextProvider {...props}>
			<LibraryManager />
		</AppContextProvider>
	);
}
