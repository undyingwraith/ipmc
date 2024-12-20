export const ITranslationServiceSymbol = Symbol.for('ITranslationService');

export interface ITranslationService {
	/**
	 * Loads the specified translation.
	 * @param key key of the translation.
	 * @param values values to be inserted into the translation.
	 */
	translate(key: string, values?: { [key: string]: string; }): string;

	/**
	 * Gets current language.
	 */
	get language(): string;

	/**
	 * Changes the current language.
	 * @param language language to set.
	 */
	changeLanguage(language: string): void;

	/**
	 * Registers an event handler for language change.
	 * @param handler the event handler to register.
	 */
	registerLanguageChange(handler: (language: string) => void): Symbol;

	/**
	 * Unregisters an event handler for language change.
	 * @param symbol the symbol of the handler to unregister.
	 */
	unregisterLanguageChange(symbol: Symbol): void;
}
