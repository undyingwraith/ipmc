import { IpmcApp } from "ipmc-ui";
import { useEffect, useState } from 'react';

function App() {
	const [started, setStarted] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			if (window.configService && window.nodeService) {
				setStarted(true);
				clearInterval(interval);
			}
		}, 100);

		return () => {
			clearInterval(interval);
		};
	});

	return started ? (
		<IpmcApp
			nodeService={window.nodeService}
			configService={window.configService}
		/>
	) : (
		<div>
			App is loading, please wait...
		</div>
	);
}

export default App;
