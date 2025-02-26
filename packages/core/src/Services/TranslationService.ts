import { Signal } from '@preact/signals-core';
import i18next from 'i18next';
import { inject, injectable, multiInject, optional } from 'inversify';
import { ILogService, ILogServiceSymbol, IPersistentSignalService, IPersistentSignalServiceSymbol, ITranslation, ITranslationService, ITranslationsSymbol } from 'ipmc-interfaces';

@injectable()
export class TranslationService implements ITranslationService {
	constructor(
		@multiInject(ITranslationsSymbol) @optional() translations: ITranslation[],
		@inject(ILogServiceSymbol) private readonly log: ILogService,
		@inject(IPersistentSignalServiceSymbol) signalService: IPersistentSignalService,
	) {
		const resources: ITranslation = {};
		for (const translationSet of translations) {
			for (const [lang, values] of Object.entries(translationSet)) {
				if (!resources.hasOwnProperty(lang)) {
					resources[lang] = { translation: {} };
				}
				resources[lang].translation = { ...resources[lang].translation, ...values.translation };
			}
		}

		this.language = signalService.get('language', 'en');

		i18next.init({
			resources,
			lng: this.language.peek(),
			interpolation: {
				escapeValue: false
			}
		});

		this.language.subscribe((language) => {
			i18next.changeLanguage(language);
		});
	}

	/**
	 * @inheritdoc
	 */
	translate(key: string, values?: { [key: string]: string; }): string {
		if (i18next.exists(key)) {
			return i18next.t(key, values);
		} else {
			this.log.warn(`Missing translation key <${key}>`);
			return `<${key}>`;
		}
	}

	/**
	 * @inheritdoc
	 */
	changeLanguage(language: string): void {
		this.language.value = language;
	}

	/**
	 * @inheritdoc
	 */
	public language: Signal<string>;
}
