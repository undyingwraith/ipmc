import { Box } from '@mui/material';
import { useComputed, useSignal } from '@preact/signals-react';
import { IIndexManager, IIndexManagerSymbol, ISortAndFilterService, ISortAndFilterServiceSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context/AppContext';
import { useAppbarButtons, usePersistentSignal, useTranslation } from '../../hooks';
import { LoadScreen, SearchField } from '../molecules';
import { Display, DisplayButtons } from '../molecules/DisplayButtons';
import { FileGrid, FileList } from '../organisms';

export function LibraryPage(props: {
	library: string;
}) {
	const { library } = props;
	const _t = useTranslation();

	const indexManager = useService<IIndexManager>(IIndexManagerSymbol);
	const sortAndFilterService = useService<ISortAndFilterService>(ISortAndFilterServiceSymbol);

	const query = useSignal('');
	const display = usePersistentSignal<Display>(Display.Poster, 'display');

	const index = indexManager.indexes.get(library)!;
	const sorted = useComputed(() => index.value == undefined ? undefined : sortAndFilterService.createFilteredList(index.value.index, query.value));

	useAppbarButtons([
		{
			component: (<SearchField query={query} />),
			position: 'start'
		},
		{
			component: (<DisplayButtons display={display} />),
			position: 'end'
		}
	]);

	return useComputed(() => {
		return sorted.value == undefined ? (
			<LoadScreen />
		) : (
			sorted.value.length === 0 ? (
				<Box>{_t('NoItems')}</Box>
			) : display.value == Display.List ? (
				<FileList
					files={sorted.value}
				/>
			) : (
				<FileGrid
					display={display}
					files={sorted.value}
				/>
			)
		);
	});
}
