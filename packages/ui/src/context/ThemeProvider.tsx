import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { useComputed } from '@preact/signals-react';
import React, { PropsWithChildren } from 'react';
import { ThemeService, ThemeServiceSymbol } from '../services';
import { useService } from './AppContext';

export function ThemeProvider(props: PropsWithChildren<{}>) {
	const themeService = useService<ThemeService>(ThemeServiceSymbol);

	return useComputed(() => (
		<MuiThemeProvider theme={themeService.theme.value}>
			{props.children}
		</MuiThemeProvider>
	));
}
