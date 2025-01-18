import Grid from '@mui/material/Grid2';
import { ReadonlySignal, useComputed, useSignal } from '@preact/signals-react';
import { createFilter } from 'ipmc-core';
import { IFileInfo, IIndexManager, IIndexManagerSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context/AppContext';
import { useLinkedSignal } from '../../hooks';
import { ErrorBoundary } from '../atoms/ErrorBoundary';
import { FileGridItem } from '../molecules/FileGridItem';
import { LoadScreen } from '../molecules/LoadScreen';
import { Display } from '../pages/LibraryManager';
import { FileView } from './FileView';

export function Library(props: {
	display: ReadonlySignal<Display>;
	query: ReadonlySignal<string | undefined>;
	library: string;
}) {
	const { display, library, query } = props;
	const spacing = 1;

	const indexManager = useService<IIndexManager>(IIndexManagerSymbol);

	const index = useLinkedSignal(indexManager.indexes.get(library)!.value);
	const selected = useSignal<IFileInfo | undefined>(undefined);


	const detail = useComputed(() => selected.value !== undefined ? (
		<FileView
			file={selected.value}
			display={display}
			onClose={() => {
				selected.value = undefined;
			}}
		/>
	) : undefined);

	return useComputed(() => {
		const i = index.value;
		const q = query.value;

		return i?.cid == undefined ? (
			<LoadScreen />
		) : (
			<>
				<Grid container spacing={spacing} sx={{ height: '100%', justifyContent: 'center', paddingTop: spacing, paddingBottom: spacing }}>
					{(q === undefined ? i.index : i.index.filter(createFilter(q))).map(v => (
						<Grid key={v.cid}>
							<ErrorBoundary>
								<FileGridItem
									onOpen={() => {
										selected.value = v;
									}}
									file={v}
									display={props.display}
								/>
							</ErrorBoundary>
						</Grid>
					))}
				</Grid>
				<ErrorBoundary>
					{detail}
				</ErrorBoundary>
			</>
		);
	});
}
