import i18next from 'i18next';
import { inject, injectable } from 'inversify';
import { ITranslationService, ITranslationsSymbol } from 'ipmc-interfaces';

@injectable()
export class TranslationService implements ITranslationService {
	constructor(@inject(ITranslationsSymbol) translations: any) {
		i18next.init({
			resources: translations,
			lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
			interpolation: {
				escapeValue: false // react already safes from xss
			}
		});
	}

	translate(key: string, values?: { [key: string]: string; }): string {
		if (i18next.exists(key)) {
			return i18next.t(key, values);
		} else {
			return `<${key}>`;
		}
	}
}
