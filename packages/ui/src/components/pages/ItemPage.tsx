import { Box, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ReadonlySignal } from '@preact/signals-react';
import { IFileInfo, isIFolderFile, isIVideoFile } from 'ipmc-interfaces';
import React from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from '../../hooks';
import { ErrorBoundary } from '../atoms';
import { FileInfoDisplay } from '../atoms/FileInfoDisplay';
import { DetailViewBar } from '../molecules/DetailViewBar';
import { FileGridItem } from '../molecules/FileGridItem';
import { VideoPlayer } from '../organisms/VideoPlayer';
import { Display } from './LibraryManager';

export function ItemPage(props: {
	item: IFileInfo;
	display: ReadonlySignal<Display>;
}) {
	const file = props.item;
	const _t = useTranslation();
	const [_, setLocation] = useLocation();

	return (
		<Stack sx={{ height: '100%', width: '100%' }} spacing={1}>
			<DetailViewBar file={file} onClose={() => history.back()} />
			{isIFolderFile(file) ? (
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
										display={props.display}
									/>
								</ErrorBoundary>
							</Grid>
						))}
					</Grid>
				</Stack>
			) : (
				<Box>
					{isIVideoFile(file) && <VideoPlayer file={file} />}
				</Box>
			)}
		</Stack>
	);
}
