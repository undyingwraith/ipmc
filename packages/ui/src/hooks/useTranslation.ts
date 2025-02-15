import { useSignal, useSignalEffect } from '@preact/signals';
import { ITranslationService, ITranslationServiceSymbol } from 'ipmc-interfaces';
import { useService } from '../context';

export function useTranslation(): (key: string, values?: { [key: string]: string; }) => string {
	const translationService = useService<ITranslationService>(ITranslationServiceSymbol);
	const language = useSignal(translationService.language);

	useSignalEffect(() => {
		const sym = translationService.registerLanguageChange((lang: string) => {
			language.value = lang;
		});

		return () => {
			translationService.unregisterLanguageChange(sym);
		};
	});


	function translate(key: string, values?: { [key: string]: string; }): string {
		return language.value !== undefined ? translationService.translate(key, values) : 'Error';
	}

	return translate;
}
