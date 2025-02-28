import { List } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useComputed, useSignal } from '@preact/signals-react';
import { createFilter } from 'ipmc-core';
import { IIndexManager, IIndexManagerSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useLocation } from 'wouter';
import { useService } from '../../context/AppContext';
import { useAppbarButtons, usePersistentSignal } from '../../hooks';
import { ErrorBoundary, FileGridItem, FileListItem, LoadScreen, SearchField } from '../molecules';
import { Display, DisplayButtons } from '../molecules/DisplayButtons';

export function LibraryPage(props: {
	library: string;
}) {
	const { library } = props;
	const [_, setLocation] = useLocation();
	const spacing = 1;

	const indexManager = useService<IIndexManager>(IIndexManagerSymbol);

	const query = useSignal('');
	const display = usePersistentSignal<Display>(Display.Poster, 'display');

	const index = indexManager.indexes.get(library)!;

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
		const i = index.value;
		const q = query.value;

		return i?.cid == undefined ? (
			<LoadScreen />
		) : display.value == Display.List ? (
			<List>
				{(i.index.filter(createFilter(q))).map(v => (
					<ErrorBoundary key={v.cid}>
						<FileListItem
							file={v}
							onOpen={() => {
								setLocation(`/${v.name}`);
							}}
						/>
					</ErrorBoundary>
				))}
			</List>

		) : (
			<Grid container spacing={spacing} sx={{ height: '100%', justifyContent: 'center', paddingTop: spacing, paddingBottom: spacing }}>
				{(i.index.filter(createFilter(q))).map(v => (
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
