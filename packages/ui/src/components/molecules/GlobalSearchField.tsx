import { InputBase } from '@mui/material';
import { useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { IGlobalSearchService } from 'ipmc-core';
import { IFileInfo, isPinFeature } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context';
import { useHotkey, useTranslation } from '../../hooks';
import { INavigationService, INavigationServiceSymbol } from '../../services';
import styles from '../atoms/DropDown/DropDown.module.scss';
import { FileList } from '../organisms';

export function GlobalSearchField(props: { searchService: IGlobalSearchService; }) {
	const { searchService } = props;
	const _t = useTranslation();
	const navigationService = useService<INavigationService>(INavigationServiceSymbol);

	const searchFieldRef = useSignal<HTMLInputElement | null>(null);
	const results = useSignal<IFileInfo[]>([]);
	const resultsVisible = useSignal(false);
	const query = useSignal('');

	useSignalEffect(() => {
		results.value = query.value.trim() !== '' ? searchService.search(query.value) : [];
	});

	useSignalEffect(() => {
		searchFieldRef.value?.addEventListener('focusin', () => {
			resultsVisible.value = true;
		});
		searchFieldRef.value?.addEventListener('focusout', () => {
			setTimeout(() => {
				resultsVisible.value = false;
			}, 100);
		});
	});

	useHotkey({
		key: 'f',
		ctrl: true,
	}, () => searchFieldRef.value?.focus());

	return (
		<div className={styles.container} style={{ flexGrow: 1 }}>
			{useComputed(() => (
				<InputBase
					sx={{ ml: 1, width: '100%' }}
					placeholder={_t('Search').value}
					inputRef={ref => searchFieldRef.value = ref}
					value={query.value}
					onChange={ev => query.value = ev.target.value}
				/>
			))}
			{useComputed(() => !resultsVisible.value ? undefined : (
				<div className={styles.dropDown}>
					{results.value.length === 0 ? (
						<div>{_t('NoItems')}</div>
					) : (
						<FileList
							files={results.value.slice(0, 9)}
							onOpen={(i) => {
								if (isPinFeature(i)) {
									navigationService.navigate(`~/${i.pinId}`);
									query.value = '';
								}
							}}
						/>
					)}
				</div>
			))}
		</div>
	);
}
