import { InputBase } from '@mui/material';
import { useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { IFileInfo, isPinFeature } from 'ipmc-interfaces';
import React from 'react';
import { useHotkey, useTranslation } from '../../hooks';
import styles from '../atoms/DropDown/DropDown.module.scss';
import { FileList } from '../organisms';
import { useLocation } from 'wouter';
import { IGlobalSearchService } from '../../services';

export function GlobalSearchField(props: { searchService: IGlobalSearchService; }) {
	const { searchService } = props;
	const [_, setLocation] = useLocation();
	const _t = useTranslation();

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
									setLocation(`~/${i.pinId}`);
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
