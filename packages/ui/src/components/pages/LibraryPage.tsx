import { Box } from '@mui/material';
import { useComputed, useSignal } from '@preact/signals-react';
import { ISortAndFilterService, ISortAndFilterServiceSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context/AppContext';
import { useTranslation } from '../../hooks';
import { ILibraryServiceSymbol, LibraryService, TDisplay } from '../../services';
import { LoadScreen } from '../molecules';
import { FileGrid, FileList } from '../organisms';

export function LibraryPage() {
	const _t = useTranslation();

	const sortAndFilterService = useService<ISortAndFilterService>(ISortAndFilterServiceSymbol);
	const libraryService = useService<LibraryService>(ILibraryServiceSymbol);
	const display = libraryService.display;

	const query = useSignal('');

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
			) : display.value == TDisplay.List ? (
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
