import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useComputed } from '@preact/signals-react';
import { IFileInfo, isIAudioFile, isIFolderFile, isIVideoFile, isPinFeature } from 'ipmc-interfaces';
import React from 'react';
import { useAppbarButtons, usePersistentSignal, useTitle, useTranslation } from '../../hooks';
import { IAppbarButtonOptions } from '../../services/AppbarButtonService';
import { FileInfoDisplay, PinButton } from '../atoms';
import { Display, DisplayButtons } from '../molecules';
import { FileGrid, FileList, VideoPlayer, AudioPlayer } from '../organisms';



export function ItemPage(props: {
	item: IFileInfo;
}) {
	const file = props.item;
	const _t = useTranslation();
	const title = useTitle(file);

	const display = usePersistentSignal<Display>(Display.Poster, 'display');

	useAppbarButtons([
		{
			component: (
				<Button onClick={() => history.back()} startIcon={<ArrowBackIcon />}>{_t('Back')}</Button>
			),
			position: 'start'
		},
		{
			component: (
				<Typography>{title}</Typography>
			),
			position: 'start'
		},
		...(isIFolderFile(file) ? [
			{
				component: (<DisplayButtons display={display} />),
				position: 'end',
			}
		] as IAppbarButtonOptions[] : []),
	]);

	return isIFolderFile(file) ? (
		<Stack sx={{ overflow: 'auto' }} spacing={1}>
			<Paper>
				<FileInfoDisplay file={file} />
				{isPinFeature(file) && <PinButton item={file} />}
			</Paper>
			{file.items.length === 0 ? (
				<Box>{_t('NoItems')}</Box>
			) : useComputed(() =>
				display.value == Display.List ? (
					<FileList
						files={file.items}
					/>
				) : (
					<FileGrid
						display={display}
						files={file.items}
					/>
				))}
		</Stack>
	) : (
		<Box>
			{isIVideoFile(file) && <VideoPlayer file={file} />}
			{isIAudioFile(file) && <AudioPlayer file={file} />}
			{isPinFeature(file) && <PinButton item={file} />}
		</Box>
	);
}
