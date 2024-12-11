export const ITranslationServiceSymbol = Symbol.for('ITranslationService');

export const ITranslationsSymbol = Symbol.for('ITranslations');

export interface ITranslationService {
	translate(key: string, values?: { [key: string]: string; }): string;
}
