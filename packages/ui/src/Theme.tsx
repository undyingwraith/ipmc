import { createTheme } from "@mui/material";

const baseTheme = createTheme({

	typography: {
		//fontFamily: '\'Roboto Condensed\', sans-serif',
		fontSize: 14,
	},
	palette: {
		warning: {
			main: '#ff8c00'
		}
	}
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
			info: {
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
				main: '#909090',
			},
			secondary: {
				main: '#e0e0e0',
			},
			info: {
				main: accentColor,
			},

		},
	});
}
