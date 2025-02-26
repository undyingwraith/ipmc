import { Signal } from '@preact/signals-core';

export const ITranslationServiceSymbol = Symbol.for('ITranslationService');

export interface ITranslationService {
	/**
	 * Loads the specified translation.
	 * @param key key of the translation.
	 * @param values values to be inserted into the translation.
	 */
	translate(key: string, values?: { [key: string]: string; }): string;

	/**
	 * Changes the current language.
	 * @param language language to set.
	 */
	changeLanguage(language: string): void;

	/**
	 * A {@link Signal} holding the value of the current language.
	 */
	language: Signal<string>;
}
