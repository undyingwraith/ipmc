import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Paper, Stack, Typography, List } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IFileInfo, isIFolderFile, isIVideoFile, isPinFeature } from 'ipmc-interfaces';
import React from 'react';
import { useLocation } from 'wouter';
import { useAppbarButtons, usePersistentSignal, useTitle, useTranslation } from '../../hooks';
import { IAppbarButtonOptions } from '../../services/AppbarButtonService';
import { FileInfoDisplay, PinButton } from '../atoms';
import { Display, DisplayButtons, ErrorBoundary, FileGridItem, FileListItem } from '../molecules';
import { VideoPlayer } from '../organisms';
import { useComputed } from '@preact/signals-react';


export function ItemPage(props: {
	item: IFileInfo;
}) {
	const file = props.item;
	const _t = useTranslation();
	const [_, setLocation] = useLocation();
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
				<div>{_t('NoItems')}</div>
			) : useComputed(() => (
				display.value == Display.List ? (
					<List>
						{file.items.map(i => (
							<ErrorBoundary key={i.cid}>
								<FileListItem
									file={i}
									onOpen={() => setLocation(`/${i.name}`)}
								/>
							</ErrorBoundary>
						)
						)}
					</List>
				) : (
					<Grid container spacing={1} sx={{ width: '100%' }}>
						{file.items.map(i => (
							<Grid key={i.cid}>
								<ErrorBoundary>
									<FileGridItem
										file={i}
										onOpen={() => setLocation(`/${i.name}`)}
										display={display}
									/>
								</ErrorBoundary>
							</Grid>
						))}
					</Grid>
				)
			))}
		</Stack >
	) : (
		<Box>
			{isIVideoFile(file) && <VideoPlayer file={file} />}
			{isPinFeature(file) && <PinButton item={file} />}
		</Box>
	);
}
