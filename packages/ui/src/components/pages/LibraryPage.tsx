import Grid from '@mui/material/Grid2';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { createFilter } from 'ipmc-core';
import { IIndexManager, IIndexManagerSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useLocation } from 'wouter';
import { useService } from '../../context/AppContext';
import { ErrorBoundary } from '../atoms/ErrorBoundary';
import { FileGridItem } from '../molecules/FileGridItem';
import { LoadScreen } from '../molecules/LoadScreen';
import { Display } from './LibraryManager';

export function LibraryPage(props: {
	display: ReadonlySignal<Display>;
	query: ReadonlySignal<string | undefined>;
	library: string;
}) {
	const { display, library, query } = props;
	const [_, setLocation] = useLocation();
	const spacing = 1;

	const indexManager = useService<IIndexManager>(IIndexManagerSymbol);

	const index = indexManager.indexes.get(library)!;

	return useComputed(() => {
		const i = index.value;
		const q = query.value;

		return i?.cid == undefined ? (
			<LoadScreen />
		) : (
			<Grid container spacing={spacing} sx={{ height: '100%', justifyContent: 'center', paddingTop: spacing, paddingBottom: spacing }}>
				{(q === undefined ? i.index : i.index.filter(createFilter(q))).map(v => (
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
