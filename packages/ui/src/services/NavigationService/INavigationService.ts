import { ReadonlySignal } from '@preact/signals-react';

export const INavigationServiceSymbol = Symbol.for('INavigationService');

/**
 * Service that handles navigation inside the app.
 */
export interface INavigationService {
	/**
	 * Navigates to specified url.
	 * @param url the url to navigate to.
	 * @param params specified url parameters to set.
	 */
	navigate(url: string, params?: URLSearchParams): void;

	/**
	 * The current path the app is on.
	 */
	path: ReadonlySignal<string>;

	/**
	 * The currently set path parameters.
	 */
	params: ReadonlySignal<URLSearchParams>;
}
