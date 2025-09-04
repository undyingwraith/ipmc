import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useComputed } from '@preact/signals-react';
import { IFileInfo, isIAudioFile, isBackdropFeature, isIFolderFile, isIVideoFile, isPinFeature } from 'ipmc-interfaces';
import React from 'react';
import { useAppbarButtons, useFileUrl, usePersistentSignal, useTitle, useTranslation } from '../../hooks';
import { IAppbarButtonOptions } from '../../services/AppbarButtonService';
import { FileInfoDisplay, PinButton } from '../atoms';
import { Display, DisplayButtons } from '../molecules';
import { FileGrid, FileList, VideoPlayer, AudioPlayer } from '../organisms';
import { ConsoleLogSink } from 'src/services/ConsoleLogSink';



export function ItemPage(props: {
	item: IFileInfo;
}) {
	const file = props.item;
	const _t = useTranslation();
	const title = useTitle(file);

	const display = usePersistentSignal<Display>(Display.Poster, 'display');
	const backdropUrl = useFileUrl(isBackdropFeature(file) && file.backdrops.length > 0 ? file.backdrops[0]?.cid : undefined);

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
			{useComputed(() => (
				<Paper sx={{ backgroundImage: backdropUrl.value ? `url('${backdropUrl.value}')` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }} square={true}>
					<FileInfoDisplay file={file} />
					{isPinFeature(file) && <PinButton item={file} />}
				</Paper>
			))}
			{useComputed(() => {
				const items = file.items.length === 1 && isIFolderFile(file.items[0]) ? file.items[0].items : file.items;

				return file.items.length === 0 ? (
					<Box>{_t('NoItems')}</Box>
				) : (
					display.value == Display.List ? (
						<FileList
							files={items}
						/>
					) : (
						<FileGrid
							display={display}
							files={items}
						/>
					)
				);
			})}
		</Stack>
	) : (
		<Box>
			{isIVideoFile(file) && <VideoPlayer file={file} />}
			{isIAudioFile(file) && <AudioPlayer file={file} />}
			{isPinFeature(file) && <PinButton item={file} />}
		</Box>
	);
}
