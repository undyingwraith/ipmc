export const ITranslationServiceSymbol = Symbol.for('ITranslationService');

export interface ITranslationService {
	translate(key: string, values?: { [key: string]: string; }): string;
}
