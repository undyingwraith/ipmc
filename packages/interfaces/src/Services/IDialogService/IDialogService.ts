import { IDialogOptions } from './IDialogOptions';
import { IFileDialogOptions } from './IFileDialogOptions';

export const IDialogServiceSymbol = Symbol.for('IDialogService');

/**
 * Service thats shows simple dialogs.
 */
export interface IDialogService {
	/**
	 * Shows a simple dialog that returns a boolean.
	 */
	boolDialog(options: IDialogOptions): Promise<boolean>;

	/**
	 * Shows a simple dialog that returns a string.
	 */
	stringDialog(options: IDialogOptions): Promise<string>;

	/**
	 * Shows a simple dialog that returns a file.
	 */
	fileDialog(options: IFileDialogOptions): Promise<any>;
}
