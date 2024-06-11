import React from 'react';
import { DetailOverlay } from '../atoms/DetailOverlay';
import { Box, Stack } from '@mui/material';
import { IFileInfo, isIFolderFile, isIVideoFile } from 'ipmc-interfaces';
import { VideoPlayer } from './VideoPlayer';
import { FolderFileView } from './FolderFileView';
import { ReadonlySignal } from '@preact/signals-react';
import { Display } from '../pages/LibraryManager';
import { DetailViewBar } from '../molecules/DetailViewBar';

export function FileView(props: { file: IFileInfo; onClose: () => void; display: ReadonlySignal<Display>; }) {
	const { file, display, onClose } = props;

	return isIFolderFile(file) ? (
		<FolderFileView file={file} onClose={onClose} display={display} />
	) : (
		<DetailOverlay>
			<Stack sx={{ height: '100%', width: '100%' }}>
				<DetailViewBar file={file} onClose={onClose} />
				<Box>
					{isIVideoFile(file) && <VideoPlayer file={file} />}
				</Box>
			</Stack>
		</DetailOverlay>
	);
}
