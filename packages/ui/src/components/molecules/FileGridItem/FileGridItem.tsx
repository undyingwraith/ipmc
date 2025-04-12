import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia } from '@mui/material';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { IFileInfo, isIVideoFile, isPosterFeature, isTitleFeature, isYearFeature } from 'ipmc-interfaces';
import React, { useRef } from 'react';
import { useFileUrl, useIsVisible } from '../../../hooks';
import { LanguageDisplay } from '../../atoms';
import { Display } from '../DisplayButtons';
import { MediaItemActions } from '../MediaItemActions';
import styles from './FileGridItem.module.css';
import posterFallback from './no-poster.png';
import thumbFallback from './no-thumbnail.png';

export function FileGridItem(props: { file: IFileInfo; onOpen: () => void; display: ReadonlySignal<Display>; }) {
	const { file, display, onOpen } = props;
	const imgRef = useRef<HTMLDivElement>(null);
	const visible = useIsVisible(imgRef);

	const posterUrl = useFileUrl(isPosterFeature(file) && file.posters.length > 0 ? file.posters[0]?.cid : undefined, visible, posterFallback);
	const thumbUrl = useFileUrl(isIVideoFile(file) && file.thumbnails.length > 0 ? file.thumbnails[0]?.cid : undefined, visible, thumbFallback);
	const url = useComputed(() => {
		switch (display.value) {
			case Display.Poster:
				return posterUrl.value;
			case Display.Thumbnail:
				return thumbUrl.value;
			default:
				return '';
		}
	});

	return useComputed(() => (
		<Card ref={imgRef} className={styles.card}>
			<CardActionArea onClick={onOpen} className={styles.actionArea}>
				<CardMedia image={url.value} className={`${styles.media} ${display.value === Display.Thumbnail && styles.thumbnail}`} />
				<CardHeader title={isTitleFeature(file) ? file.title : file.name} subheader={isYearFeature(file) ? file.year : undefined} className={styles.title} />
				{isIVideoFile(file) && (
					<CardContent>
						<LanguageDisplay video={file} />
					</CardContent>
				)}
			</CardActionArea>
			<CardActions>
				<MediaItemActions file={file} onOpen={onOpen} />
			</CardActions>
		</Card>
	));
}
