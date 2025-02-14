import 'ipmc-ui/style.css';
import { render } from 'preact';
import App from './App';

function tryRender() {
	if (!window.configService) {
		setTimeout(tryRender, 100);
	} else {
		render(<App />, document.getElementById('root')!);
	}
}

tryRender();
