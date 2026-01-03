import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Stack } from '@mui/material';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { IFileInfo, isIFolderFile, isIVideoFile } from 'ipmc-interfaces';
import React, { useRef } from 'react';
import { useService } from '../../../context';
import { useFileUrl } from '../../../hooks';
import { IMediaPreferenceService, IMediaPreferenceServiceSymbol } from '../../../services';
import { EpisodeDisplay, LanguageDisplay, VideoMetadataDisplay } from '../../atoms';
import posterFallback from '../../svg/poster.svg';
import thumbFallback from '../../svg/thumb.svg';
import { Display } from '../DisplayButtons';
import { MediaItemActions } from '../MediaItemActions';
import styles from './FileGridItem.module.css';

export function FileGridItem(props: {
	file: IFileInfo;
	onOpen: () => void;
	display: ReadonlySignal<Display>;
	style?: any;
}) {
	const { file, display, onOpen } = props;
	const mediaService = useService<IMediaPreferenceService>(IMediaPreferenceServiceSymbol);
	const imgRef = useRef<HTMLDivElement>(null);

	const urlSource = useComputed(() => {
		switch (display.value) {
			case Display.Poster:
				return mediaService.getPoster(file)?.cid;
			case Display.Thumbnail:
				return mediaService.getThumbnail(file)?.cid;
			default:
				return '';
		}
	});
	const fileUrl = useFileUrl(urlSource.value);
	const url = useComputed(() => fileUrl.value ?? (urlSource.value ? undefined : (display.value === Display.Poster ? posterFallback : thumbFallback)));

	return useComputed(() => (
		<Card ref={imgRef} className={styles.card}>
			<CardActionArea onClick={onOpen} className={styles.actionArea}>
				<CardMedia image={url.value} className={`${styles.media} ${display.value === Display.Thumbnail && styles.thumbnail}`} />
				<CardHeader
					className={styles.title}
					slotProps={{ title: { title: mediaService.getHeader(file) } }}
					title={mediaService.getHeader(file)}
					subheader={mediaService.getSubheader(file)}
				/>
				{(isIVideoFile(file) || isIFolderFile(file)) && (
					<CardContent>
						<Stack direction={'column'} spacing={1}>
							{isIVideoFile(file) && (
								<VideoMetadataDisplay file={file} />
							)}
							{isIFolderFile(file) && (
								<EpisodeDisplay file={file} />
							)}
							<LanguageDisplay file={file} />
						</Stack>
					</CardContent>
				)}
			</CardActionArea>
			<CardActions>
				<MediaItemActions file={file} fullwidth={true} />
			</CardActions>
		</Card>
	));
}
