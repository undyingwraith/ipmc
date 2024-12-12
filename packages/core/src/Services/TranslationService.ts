import i18next from 'i18next';
import { multiInject, injectable, optional } from 'inversify';
import { ITranslationService, ITranslationsSymbol, ITranslation } from 'ipmc-interfaces';

@injectable()
export class TranslationService implements ITranslationService {
	constructor(@multiInject(ITranslationsSymbol) @optional() translations: ITranslation[]) {
		const resources: ITranslation = {};
		for (const translationSet of translations) {
			for (const [lang, values] of Object.entries(translationSet)) {
				if (!resources.hasOwnProperty(lang)) {
					resources[lang] = { translation: {} };
				}
				resources[lang].translation = { ...resources[lang].translation, ...values.translation };
			}
		}

		i18next.init({
			resources,
			lng: "en",
			interpolation: {
				escapeValue: false
			}
		});
	}

	translate(key: string, values?: { [key: string]: string; }): string {
		if (i18next.exists(key)) {
			return i18next.t(key, values);
		} else {
			console.warn(`Missing translation key <${key}>`);
			return `<${key}>`;
		}
	}
}
