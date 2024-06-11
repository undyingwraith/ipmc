import React from 'react';
import { DetailOverlay } from '../atoms/DetailOverlay';
import { Box, Button, Paper, Stack } from '@mui/material';
import { useTranslation } from '../../hooks/useTranslation';
import { IFileInfo, isIFolderFile, isIVideoFile } from 'ipmc-interfaces';
import { VideoPlayer } from './VideoPlayer';
import { FolderFileView } from './FolderFileView';
import { ReadonlySignal } from '@preact/signals-react';
import { Display } from '../pages/LibraryManager';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function FileView(props: { file: IFileInfo; onClose: () => void; display: ReadonlySignal<Display>; }) {
	const { file, display, onClose } = props;
	const _t = useTranslation();

	return isIFolderFile(file) ? (
		<FolderFileView file={file} onClose={onClose} display={display} />
	) : (
		<DetailOverlay>
			<Stack sx={{ height: '100%', width: '100%' }}>
				<Paper>
					<Button onClick={onClose} startIcon={<ArrowBackIcon />}>{_t('Back')}</Button>
				</Paper>
				<Box>
					{isIVideoFile(file) && <VideoPlayer file={file} />}
				</Box>
			</Stack>
		</DetailOverlay>
	);
}
