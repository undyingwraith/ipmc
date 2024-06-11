import { ReadonlySignal, computed, useSignal, useSignalEffect } from '@preact/signals-react';
import { useTranslation as useTrans } from 'react-i18next';

export function useTranslation(): (key: string) => ReadonlySignal<string> {
	const [_t, i18n] = useTrans();
	const language = useSignal(i18n.language);

	useSignalEffect(() => {
		i18n.on('languageChanged', () => {
			language.value = i18n.language;
		});
	});


	function translate(key: string): ReadonlySignal<string> {
		return computed(() => {
			return language.value !== undefined ? _t(key) : 'Error';
		});
	}

	return translate;
}
