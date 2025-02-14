import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { useComputed } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { ThemeService, ThemeServiceSymbol } from '../services';
import { useService } from './AppContext';

export function ThemeProvider(props: {
	children: ComponentChildren;
}) {
	const themeService = useService<ThemeService>(ThemeServiceSymbol);

	return useComputed(() => (
		<MuiThemeProvider theme={themeService.theme.value}>
			{props.children}
		</MuiThemeProvider>
	));
}
