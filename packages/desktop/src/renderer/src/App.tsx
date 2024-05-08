import { IpmcApp } from "ipmc-core";

function App(): JSX.Element {
	return <IpmcApp
		nodeService={window.nodeService}
		configService={window.configService}
	/>
}

export default App;
