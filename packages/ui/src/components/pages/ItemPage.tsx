import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useSignal } from '@preact/signals-react';
import { IFileInfo, isIFolderFile, isIVideoFile } from 'ipmc-interfaces';
import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useService } from '../../context';
import { useTitle, useTranslation } from '../../hooks';
import { AppbarButtonService, AppbarButtonServiceSymbol } from '../../services';
import { ErrorBoundary, FileInfoDisplay } from '../atoms';
import { Display, DisplayButtons, FileGridItem } from '../molecules';
import { VideoPlayer } from '../organisms';

export function ItemPage(props: {
	item: IFileInfo;
}) {
	const file = props.item;
	const _t = useTranslation();
	const [_, setLocation] = useLocation();
	const appbarService = useService<AppbarButtonService>(AppbarButtonServiceSymbol);
	const title = useTitle(file);

	const display = useSignal<Display>(Display.Poster);

	useEffect(() => {
		const backBtn = appbarService.registerAppbarButton({
			component: (
				<Button onClick={() => history.back()} startIcon={<ArrowBackIcon />}>{_t('Back')}</Button>
			),
			position: 'start'
		});
		const titleComp = appbarService.registerAppbarButton({
			component: (
				<Typography>{title}</Typography>
			),
			position: 'start'
		});


		function unload() {
			appbarService.unRegisterAppbarButton(backBtn);
			appbarService.unRegisterAppbarButton(titleComp);
		}

		if (isIFolderFile(file)) {
			const btns = appbarService.registerAppbarButton({
				component: (
					<DisplayButtons display={display} />
				),
				position: 'end'
			});

			return () => {
				unload();
				appbarService.unRegisterAppbarButton(btns);
			};
		}

		return unload;
	}, []);

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
		</Box>
	);
}
