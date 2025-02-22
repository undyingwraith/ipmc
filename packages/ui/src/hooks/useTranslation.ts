import { ReadonlySignal, computed } from '@preact/signals-react';
import { ITranslationService, ITranslationServiceSymbol } from 'ipmc-interfaces';
import { useService } from '../context';

export function useTranslation(): (key: string, values?: { [key: string]: string; }) => ReadonlySignal<string> {
	const translationService = useService<ITranslationService>(ITranslationServiceSymbol);

	function translate(key: string, values?: { [key: string]: string; }): ReadonlySignal<string> {
		return computed(() => {
			return translationService.language.value !== undefined ? translationService.translate(key, values) : 'Error';
		});
	}

	return translate;
}
