import { IKeyValueStoreSymbol, ILogServiceSymbol, ILogSinkSymbol, IObjectStoreSymbol, IPersistentSignalServiceSymbol, ITranslation, ITranslationService, ITranslationServiceSymbol, ITranslationsSymbol } from 'ipmc-interfaces';
import { describe, expect, test, vi } from 'vitest';
import { Application, LogService, MemoryKeyValueStore, MemoryLogSink, ObjectStore, PersistentSignalService, TranslationService } from '../../src';

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
	app.register(LogService, ILogServiceSymbol);
	app.register(MemoryLogSink, ILogSinkSymbol);
	app.register(TranslationService, ITranslationServiceSymbol);
	app.register(MemoryKeyValueStore, IKeyValueStoreSymbol);
	app.register(ObjectStore, IObjectStoreSymbol);
	app.register(PersistentSignalService, IPersistentSignalServiceSymbol);
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
		const sink = app.getService<MemoryLogSink>(ILogSinkSymbol)!;

		expect(translationService.translate('InvalidKey')).toBe('<InvalidKey>');
		expect(sink.logs.length).toBe(1);
		expect(sink.logs[0].message).toBe('Missing translation key <InvalidKey>');
	});
});
