export const ITranslationsSymbol = Symbol.for('ITranslations');

export type ITranslation = {
	[key: string]: {
		translation: {
			[key: string]: string;
		};
	};
};
