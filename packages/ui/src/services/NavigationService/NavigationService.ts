import { Signal } from '@preact/signals-react';
import { INavigationService } from './INavigationService';
import { injectable } from 'inversify';

@injectable()
export class NavigationService implements INavigationService {
	constructor() {
		addEventListener('hashchange', () => {
			this.path.value = this.getPath();
			this.params.value = this.getParams();
		});
	}

	/**
	 * @inheritdoc
	 */
	public navigate(to: string, params?: URLSearchParams) {
		const oldURL = location.href;
		const absoluteUrl = to[0] === '.' ? this.getPath() + to.slice(1) : to.slice(1);

		const url = new URL(location.href);
		const [hash, search] = encodeURIComponent(absoluteUrl).replaceAll('%2F', '/').replace(/^#?\/?/, "").split("?");
		url.hash = `/${hash}`;
		if (search || params) url.search = search ?? params?.toString();
		const newURL = url.href;
		window.history.pushState(null, '', url.href);

		// dispatch hashchange event
		dispatchEvent(new HashChangeEvent("hashchange", { oldURL, newURL }));
	}

	/**
	 * @inheritdoc
	 */
	public path = new Signal(this.getPath());

	/**
	 * @inheritdoc
	 */
	public params = new Signal(this.getParams());

	/**
	 * Fetches the current active path.
	 * @returns the active path.
	 */
	private getPath(): string {
		return decodeURIComponent(window.location.hash.substring(1));
	}

	/**
	 * Fetches the current {@link URLSearchParams}.
	 * @returns the current {@link URLSearchParams}.
	 */
	private getParams(): URLSearchParams {
		return new URLSearchParams(window.location.search);
	}
}
