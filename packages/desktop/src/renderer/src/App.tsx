import { IpmcApp } from "ipmc-ui";

function App() {
	return (
		<IpmcApp
			nodeService={window.nodeService}
			configService={window.configService}
		/>
	);
}

export default App;
