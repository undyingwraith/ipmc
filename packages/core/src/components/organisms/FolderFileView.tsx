import React from 'react';
import { Button, Grid, Paper, Stack } from '@mui/material';
import { IFileInfo, IFolderFile } from '../../service';
import { ReadonlySignal, useComputed, useSignal } from '@preact/signals-react';
import { DetailOverlay } from '../atoms/DetailOverlay';
import { FileGridItem } from '../molecules/FileGridItem';
import { Display } from '../pages/LibraryManager';
import { ErrorBoundary } from '../atoms/ErrorBoundary';
import { FileView } from './FileView';
import { useTranslation } from '../../hooks/useTranslation';

export function FolderFileView(props: { file: IFolderFile; onClose: () => void; display: ReadonlySignal<Display>; }) {
	const { display } = props;
	const _t = useTranslation();
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

	return <DetailOverlay>
		<Stack sx={{ height: '100%', width: '100%' }}>
			<Paper>
				<Button onClick={props.onClose}>{_t('Back')}</Button>
			</Paper>
			<Grid container>
				{props.file.items.map(i => (
					<Grid item key={i.cid}>
						<ErrorBoundary>
							<FileGridItem
								file={i}
								onOpen={() => {
									selected.value = i;
								}}
								display={display}
							/>
						</ErrorBoundary>
					</Grid>
				))}
			</Grid>
		</Stack>
		{detail}
	</DetailOverlay>;
}
