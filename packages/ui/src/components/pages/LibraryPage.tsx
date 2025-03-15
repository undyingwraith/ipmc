import Grid from '@mui/material/Grid2';
import { useComputed, useSignal } from '@preact/signals-react';
import { IIndexManager, IIndexManagerSymbol, ISortAndFilterService, ISortAndFilterServiceSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useLocation } from 'wouter';
import { useService } from '../../context/AppContext';
import { useAppbarButtons, usePersistentSignal, useTranslation } from '../../hooks';
import { ErrorBoundary, FileGridItem, LoadScreen, SearchField } from '../molecules';
import { Display, DisplayButtons } from '../molecules/DisplayButtons';

export function LibraryPage(props: {
	library: string;
}) {
	const { library } = props;
	const [_, setLocation] = useLocation();
	const _t = useTranslation();
	const spacing = 1;

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
			<Grid container spacing={spacing} sx={{ height: '100%', justifyContent: 'center', paddingTop: spacing, paddingBottom: spacing }}>
				{sorted.value.length === 0 ? (
					<Grid>{_t('NoItems')}</Grid>
				) : sorted.value.map(v => (
					<Grid key={v.cid}>
						<ErrorBoundary>
							<FileGridItem
								onOpen={() => {
									setLocation(`/${v.name}`);
								}}
								file={v}
								display={display}
							/>
						</ErrorBoundary>
					</Grid>
				))}
			</Grid>
		);
	});
}
