import { IpmcLauncher, ThemeContextProvider } from "ipmc-ui";

function App() {
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
