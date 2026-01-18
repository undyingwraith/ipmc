import { Box } from '@mui/material';
import { useComputed, useSignal } from '@preact/signals-react';
import { ISortAndFilterService, ISortAndFilterServiceSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context/AppContext';
import { usePersistentSignal, useTranslation } from '../../hooks';
import { ILibraryServiceSymbol, LibraryService } from '../../services';
import { LoadScreen } from '../molecules';
import { Display } from '../molecules/DisplayButtons';
import { FileGrid, FileList } from '../organisms';

export function LibraryPage() {
	const _t = useTranslation();

	const sortAndFilterService = useService<ISortAndFilterService>(ISortAndFilterServiceSymbol);
	const libraryService = useService<LibraryService>(ILibraryServiceSymbol);

	const query = useSignal('');
	const display = usePersistentSignal<Display>(Display.Poster, 'display');

	const sorted = useComputed(() => libraryService.activeLibraryItems.value == undefined
		? undefined
		: sortAndFilterService.createFilteredList(libraryService.activeLibraryItems.value, query.value)
	);


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
