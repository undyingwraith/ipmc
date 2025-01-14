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
				main: '#e0e0e0',
			},
			secondary: {
				main: accentColor,
			},
		},
	});
}
