import { IpmcApp, IThemeServiceConfig, IThemeServiceConfigSymbol } from "ipmc-ui";
import { useEffect, useState } from 'react';

function App() {
	const [darkMode, setDarkMode] = useState<boolean>();

	useEffect(() => {
		const interval = setInterval(() => {
			if (window.configService && window.nodeService) {
				window.themeService.shouldUseDarkColors().then((darkMode) => {
					setDarkMode(darkMode);
				});
				clearInterval(interval);
			}
		}, 100);

		return () => {
			clearInterval(interval);
		};
	});

	return darkMode != null ? (
		<IpmcApp
			nodeService={window.nodeService}
			configService={window.configService}
			setup={(app) => {
				app.registerConstant<Partial<IThemeServiceConfig>>({
					darkMode: darkMode,
				}, IThemeServiceConfigSymbol);
			}}
		/>
	) : (
		<div>
			App is loading, please wait...
		</div>
	);
}

export default App;
