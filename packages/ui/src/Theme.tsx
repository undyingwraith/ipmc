import { createTheme } from "@mui/material";

const baseTheme = createTheme({
	cssVariables: true,
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
		palette: {
			mode: 'dark',
			primary: {
				main: accentColor,
			},
			secondary: {
				main: '#fafafa',
			},
		},
	});
}

export function createLightTheme(accentColor: string) {
	return createTheme({
		...baseTheme,
		palette: {
			mode: 'light',
			primary: {
				main: accentColor,
			},
			secondary: {
				main: '#e0e0e0',
			},
		},
	});
}
