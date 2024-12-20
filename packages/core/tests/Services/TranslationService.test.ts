import { describe, expect, test, vi } from 'vitest';
import { Application, CoreModule, TranslationService } from '../../src';
import { ITranslation, ITranslationService, ITranslationServiceSymbol, ITranslationsSymbol } from 'ipmc-interfaces';

const translations: ITranslation = {
	en: {
		translation: {
			'test': 'this is a test string',
			'testInterpolation': 'this is a test string with {{interpolation}}',
		}
	},
	de: {
		translation: {
			'test': 'das ist ein test string',
			'testInterpolation': 'das ist ein test string mit {{interpolation}}',
		}
	}
};

describe('TranslationService', () => {
	const app = new Application();
	app.register(TranslationService, ITranslationServiceSymbol);
	app.registerConstantMultiple(translations, ITranslationsSymbol);

	test('correctly translates a string', () => {
		const translationService = app.getService<ITranslationService>(ITranslationServiceSymbol)!;

		translationService.changeLanguage('en');
		expect(translationService.translate('test')).toBe('this is a test string');

		translationService.changeLanguage('de');
		expect(translationService.translate('test')).toBe('das ist ein test string');
	});

	test('correctly translates a interpolated string', () => {
		const translationService = app.getService<ITranslationService>(ITranslationServiceSymbol)!;

		translationService.changeLanguage('en');
		expect(translationService.translate('testInterpolation', { interpolation: 'example' })).toBe('this is a test string with example');

		translationService.changeLanguage('de');
		expect(translationService.translate('testInterpolation', { interpolation: 'beispiel' })).toBe('das ist ein test string mit beispiel');
	});

	test('Invalid key returns key as result', () => {
		const translationService = app.getService<ITranslationService>(ITranslationServiceSymbol)!;

		expect(translationService.translate('InvalidKey')).toBe('<InvalidKey>');
	});

	test('language change event gets triggered', () => {
		const translationService = app.getService<ITranslationService>(ITranslationServiceSymbol)!;
		translationService.changeLanguage('en');

		const handler = {
			handle: () => {
				//NOOP
			}
		};
		const spy = vi.spyOn(handler, 'handle');

		const sym = translationService.registerLanguageChange(handler.handle);
		translationService.changeLanguage('de');

		expect(spy).toBeCalledTimes(1);
		expect(translationService.language).toBe('de');

		translationService.unregisterLanguageChange(sym);
		translationService.changeLanguage('en');

		expect(spy).toBeCalledTimes(1);
		expect(translationService.language).toBe('en');
	});
});
