import { ReadonlySignal, computed, useSignal, useSignalEffect } from '@preact/signals-react';
import { useService } from '../context';
import { ITranslationService, ITranslationServiceSymbol } from 'ipmc-interfaces';

export function useTranslation(): (key: string, values?: { [key: string]: string; }) => ReadonlySignal<string> {
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


	function translate(key: string, values?: { [key: string]: string; }): ReadonlySignal<string> {
		return computed(() => {
			return language.value !== undefined ? translationService.translate(key, values) : 'Error';
		});
	}

	return translate;
}
