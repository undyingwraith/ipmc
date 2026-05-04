import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Stack } from '@mui/material';
import { useComputed } from '@preact/signals-react';
import { IFileInfo, isIFolderFile, isIVideoFile } from 'ipmc-interfaces';
import React, { useRef } from 'react';
import { useService } from '../../../context';
import { useFileUrl } from '../../../hooks';
import { ILibraryService, ILibraryServiceSymbol, IMediaPreferenceService, IMediaPreferenceServiceSymbol, TDisplay } from '../../../services';
import { EpisodeDisplay, LanguageDisplay, VideoMetadataDisplay } from '../../atoms';
import posterFallback from '../../svg/poster.svg';
import thumbFallback from '../../svg/thumb.svg';
import { MediaItemActions } from '../MediaItemActions';
import styles from './FileGridItem.module.css';

export function FileGridItem(props: {
	file: IFileInfo;
	onOpen: () => void;
	style?: any;
}) {
	const { file, onOpen } = props;
	const mediaService = useService<IMediaPreferenceService>(IMediaPreferenceServiceSymbol);
	const libraryService = useService<ILibraryService>(ILibraryServiceSymbol);
	const display = libraryService.display;

	const imgRef = useRef<HTMLDivElement>(null);

	const urlSource = useComputed(() => {
		switch (display.value) {
			case TDisplay.Poster:
				return mediaService.getPoster(file)?.cid;
			case TDisplay.Thumbnail:
				return mediaService.getThumbnail(file)?.cid;
			default:
				return '';
		}
	});
	const fileUrl = useFileUrl(urlSource.value);
	const url = useComputed(() => fileUrl.value ?? (urlSource.value ? undefined : (display.value === TDisplay.Poster ? posterFallback : thumbFallback)));

	return useComputed(() => (
		<Card ref={imgRef} className={styles.card}>
			<CardActionArea onClick={onOpen} className={styles.actionArea}>
				<CardMedia image={url.value} className={`${styles.media} ${display.value === TDisplay.Thumbnail && styles.thumbnail}`} />
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
