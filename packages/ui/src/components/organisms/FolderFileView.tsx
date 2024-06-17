import React from 'react';
import { Grid, Paper, Stack } from '@mui/material';
import { IFileInfo, IFolderFile, isIFolderFile } from 'ipmc-interfaces';
import { ReadonlySignal, useComputed, useSignal } from '@preact/signals-react';
import { DetailOverlay } from '../atoms/DetailOverlay';
import { FileGridItem } from '../molecules/FileGridItem';
import { Display } from '../pages/LibraryManager';
import { ErrorBoundary } from '../atoms/ErrorBoundary';
import { FileView } from './FileView';
import { useTranslation } from '../../hooks/useTranslation';
import { FileInfoDisplay } from '../atoms/FileInfoDisplay';
import { useHotkey } from '../../hooks/useHotkey';
import { DetailViewBar } from '../molecules/DetailViewBar';

export function FolderFileView(props: { file: IFolderFile; onClose: () => void; display: ReadonlySignal<Display>; }) {
	const { display, file, onClose } = props;
	const _t = useTranslation();
	const selected = useSignal<IFileInfo | undefined>(undefined);

	useHotkey({ key: 'Escape' }, () => {
		onClose();
	});

	const detail = useComputed(() => selected.value !== undefined ? (
		<FileView
			file={selected.value}
			display={display}
			onClose={() => {
				selected.value = undefined;
			}}
		/>
	) : undefined);

	const items = file.items.length === 1 && isIFolderFile(file.items[0]) ? file.items[0].items : file.items;

	return <DetailOverlay>
		<Stack sx={{ height: '100%', width: '100%', overflow: 'hidden' }} spacing={1}>
			<DetailViewBar file={file} onClose={onClose} />
			<Stack sx={{ overflow: 'auto' }} spacing={1}>
				<Paper>
					<FileInfoDisplay file={file} />
				</Paper>
				<Grid container spacing={1} sx={{ width: '100%' }}>
					{items.length === 0 ? (
						<Grid item>{_t('NoItems')}</Grid>
					) : items.map(i => (
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
		</Stack>
		{detail}
	</DetailOverlay>;
}
