import { CoreModule } from 'ipmc-core';
import { AppContextProvider } from 'ipmc-ui';
import React from 'react';
import 'reflect-metadata';

export function App() {
	return (
		<AppContextProvider
			setup={(app) => {
				app.use(CoreModule);
			}}
		>
			<div>started</div>
		</AppContextProvider>
	);
};
