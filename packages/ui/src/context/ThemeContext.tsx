import React, { PropsWithChildren, createContext, useContext } from 'react';
import { Signal, useComputed, useSignal } from '@preact/signals-react';
import { createDarkTheme, createLightTheme } from '../Theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

export interface IThemeContext {
	darkMode: Signal<boolean>;
}

const ThemeContext = createContext<IThemeContext>({} as IThemeContext);

export function ThemeContextProvider(props: PropsWithChildren<{}>) {
	const darkMode = useSignal<boolean>(true);

	const accentColor = useComputed(() => '#6200EE');
	const theme = useComputed(() => darkMode.value ? createDarkTheme(accentColor.value) : createLightTheme(accentColor.value));

	return (
		<ThemeContext.Provider value={{
			darkMode,
		}}>
			<ThemeProvider theme={theme.value}>
				<CssBaseline />
				{props.children}
			</ThemeProvider>
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	return useContext(ThemeContext);
}
