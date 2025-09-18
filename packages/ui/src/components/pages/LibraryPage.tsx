import { Box } from '@mui/material';
import { useComputed } from '@preact/signals-react';
import { IIndexManager, IIndexManagerSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context/AppContext';
import { usePersistentSignal, useTranslation } from '../../hooks';
import { ISortAndFilterService, ISortAndFilterServiceSymbol } from '../../services';
import { LoadScreen } from '../molecules';
import { Display } from '../molecules/DisplayButtons';
import { FileGrid, FileList } from '../organisms';

export function LibraryPage(props: {
	library: string;
}) {
	const { library } = props;
	const _t = useTranslation();

	const indexManager = useService<IIndexManager>(IIndexManagerSymbol);
	const sortAndFilterService = useService<ISortAndFilterService>(ISortAndFilterServiceSymbol);

	const display = usePersistentSignal<Display>(Display.Poster, 'display');

	const index = indexManager.indexes.get(library)!;
	const sorted = useComputed(() => index.value == undefined ? undefined : sortAndFilterService.filterList(index.value.index).value);

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
