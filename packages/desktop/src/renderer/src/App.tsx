import { IpmApp } from "ipm-core";

function App(): JSX.Element {
	return <IpmApp
		nodeService={window.nodeService}
		configService={window.configService}
	/>
}

export default App;
