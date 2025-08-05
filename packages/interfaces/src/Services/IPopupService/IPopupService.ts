import { IPopupOptions } from './IPopupOptions';

export const IPopupServiceSymbol = Symbol.for('IPopupService');

export interface IPopupService {
	/**
	 * Shows a dialog.
	 * @param options options of the popup.
	 */
	show(options: IPopupOptions): Promise<void>;
}
