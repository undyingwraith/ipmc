import { Signal, useSignal } from '@preact/signals-react';
import React from 'react';
import { useHotkey, useTranslation } from '../../hooks';
import { TextInput } from '../atoms';

export function SearchField(props: { query: Signal<string>; }) {
	const _t = useTranslation();

	const searchFieldRef = useSignal<HTMLInputElement | null>(null);

	useHotkey({
		key: 'f',
		ctrl: true,
	}, () => searchFieldRef.value?.focus());

	return (
		<TextInput
			label={_t('Search')}
			value={props.query}
			inputRef={searchFieldRef}
			variant={'standard'}
		/>
	);
}
