import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Stack } from '@mui/material';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { IFileInfo, isBackdropFeature, isIFolderFile, isIVideoFile, isPosterFeature, isTitleFeature, isYearFeature } from 'ipmc-interfaces';
import React, { useRef } from 'react';
import { useFileUrl, useIsVisible } from '../../../hooks';
import { LanguageDisplay } from '../../atoms';
import { EpisodeDisplay } from '../../atoms/EpisodeDisplay';
import { Display } from '../DisplayButtons';
import { MediaItemActions } from '../MediaItemActions';
import styles from './FileGridItem.module.css';
import posterFallback from './no-poster.png';
import thumbFallback from './no-thumbnail.png';

export function FileGridItem(props: { file: IFileInfo; onOpen: () => void; display: ReadonlySignal<Display>; }) {
	const { file, display, onOpen } = props;
	const imgRef = useRef<HTMLDivElement>(null);
	const visible = useIsVisible(imgRef);

	const urlSource = useComputed(() => {
		switch (display.value) {
			case Display.Poster:
				return isPosterFeature(file) && file.posters.length > 0
					? file.posters[0]?.cid
					: undefined;
			case Display.Thumbnail:
				return isIVideoFile(file) && file.thumbnails.length > 0
					? file.thumbnails[0]?.cid
					: isBackdropFeature(file) && file.backdrops.length > 0
						? file.backdrops[0]?.cid
						: undefined;
			default:
				return '';
		}
	});
	const fileUrl = useFileUrl(urlSource.value, visible);
	const url = useComputed(() => fileUrl.value ?? (urlSource.value ? undefined : (display.value === Display.Poster ? posterFallback : thumbFallback)));

	return useComputed(() => (
		<Card ref={imgRef} className={styles.card}>
			<CardActionArea onClick={onOpen} className={styles.actionArea}>
				<CardMedia image={url.value} className={`${styles.media} ${display.value === Display.Thumbnail && styles.thumbnail}`} />
				<CardHeader title={isTitleFeature(file) ? file.title : file.name} subheader={isYearFeature(file) ? file.year : undefined} className={styles.title} />
				{(isIVideoFile(file) || isIFolderFile(file)) && (
					<CardContent>
						<Stack direction={'column'} spacing={1}>
							{isIFolderFile(file) && (
								<EpisodeDisplay file={file} />
							)}
							<LanguageDisplay file={file} />
						</Stack>
					</CardContent>
				)}
			</CardActionArea>
			<CardActions>
				<MediaItemActions file={file} onOpen={onOpen} />
			</CardActions>
		</Card>
	));
}
