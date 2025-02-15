import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useSignal } from '@preact/signals';
import { IFileInfo, isIFolderFile, isIVideoFile, isPinFeature } from 'ipmc-interfaces';
import { useLocation } from 'wouter-preact';
import { useAppbarButtons, useTitle, useTranslation } from '../../hooks';
import { IAppbarButtonOptions } from '../../services/AppbarButtonService';
import { ErrorBoundary, FileInfoDisplay, PinButton } from '../atoms';
import { Display, DisplayButtons, FileGridItem } from '../molecules';
import { VideoPlayer } from '../organisms';

export function ItemPage(props: {
	item: IFileInfo;
}) {
	const file = props.item;
	const _t = useTranslation();
	const [_, setLocation] = useLocation();
	const title = useTitle(file);

	const display = useSignal<Display>(Display.Poster);

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
			</Paper>
			<Grid container spacing={1} sx={{ width: '100%' }}>
				{file.items.length === 0 ? (
					<Grid>{_t('NoItems')}</Grid>
				) : file.items.map(i => (
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
		</Stack>
	) : (
		<Box>
			{isIVideoFile(file) && <VideoPlayer file={file} />}
			{isPinFeature(file) && <PinButton item={file} />}
		</Box>
	);
}
