import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'ipmc-ui/style.css';

function tryRender() {
	if (!window.configService) {
		setTimeout(tryRender, 100);
	} else {
		ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
			<React.StrictMode>
				<App />
			</React.StrictMode>
		);
	}
}

tryRender();
