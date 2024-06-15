import React from 'react';
import { FileGridItem } from '../molecules/FileGridItem';
import { FileView } from './FileView';
import { ReadonlySignal, useComputed, useSignal } from '@preact/signals-react';
import { LoadScreen } from '../molecules/LoadScreen';
import { Grid } from '@mui/material';
import { IFileInfo } from 'ipmc-interfaces';
import { Display } from '../pages/LibraryManager';
import { useProfile } from '../../context/ProfileContext';
import { useWatcher } from '../../hooks';
import { ErrorBoundary } from '../atoms/ErrorBoundary';
import { createFilter } from 'ipmc-core';

export function Library(props: {
	display: ReadonlySignal<Display>;
	query: ReadonlySignal<string | undefined>;
	library: string;
}) {
	const { display, library, query } = props;
	const { profile } = useProfile();

	const selected = useSignal<IFileInfo | undefined>(undefined);
	const index = useWatcher<{ cid: string; values: IFileInfo[]; } | undefined>(profile.libraries.get(library)?.value.index as { cid: string; values: IFileInfo[]; } | undefined);


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
				<Grid container spacing={1} sx={{ height: '100%', justifyContent: 'center' }}>
					{(q === undefined ? i.values : i.values.filter(createFilter(q))).map(v => (
						<Grid item key={v.cid}>
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
