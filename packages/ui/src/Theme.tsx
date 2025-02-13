import { createTheme } from "@mui/material";

const baseTheme = createTheme({

	typography: {
		//fontFamily: '\'Roboto Condensed\', sans-serif',
		fontSize: 14,
	},
});

export function createDarkTheme(accentColor: string) {
	return createTheme({
		...baseTheme,
		cssVariables: true,
		palette: {
			mode: 'dark',
			primary: {
				main: '#e0e0e0',
			},
			secondary: {
				main: '#fafafa',
			},
			warning: {
				main: accentColor,
			},
		},
	});
}

export function createLightTheme(accentColor: string) {
	return createTheme({
		...baseTheme,
		cssVariables: true,
		palette: {
			mode: 'light',
			primary: {
				main: '#fafafa',
			},
			secondary: {
				main: '#e0e0e0',
			},
			warning: {
				main: accentColor,
			},
		},
	});
}
