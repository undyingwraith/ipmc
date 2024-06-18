import { IpmcLauncher, ThemeContextProvider } from "ipmc-ui";

function App(): JSX.Element {
	return (
		<ThemeContextProvider>
			<IpmcLauncher
				nodeService={window.nodeService}
				configService={window.configService}
			/>
		</ThemeContextProvider>
	);
}

export default App;
