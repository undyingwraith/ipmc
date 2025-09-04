import { AspectRatio, HourglassFull } from '@mui/icons-material';
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Chip, Stack } from '@mui/material';
import { ReadonlySignal, Signal, useComputed } from '@preact/signals-react';
import { IFileInfo, isBackdropFeature, isIEpisodeMetadata, isIFolderFile, isIVideoFile, isPosterFeature, isTitleFeature, isYearFeature } from 'ipmc-interfaces';
import React, { useRef } from 'react';
import { useFileUrl, useIsVisible } from '../../../hooks';
import { EpisodeDisplay, LanguageDisplay, TimeDisplay } from '../../atoms';
import { Display } from '../DisplayButtons';
import { MediaItemActions } from '../MediaItemActions';
import styles from './FileGridItem.module.css';
import posterFallback from '../../svg/poster.svg';
import thumbFallback from '../../svg/thumb.svg';

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
				<CardHeader
					className={styles.title}
					title={isTitleFeature(file) ? file.title : file.name}
					subheader={isYearFeature(file) ? file.year : isIEpisodeMetadata(file) ? `S${file.season} E${file.episode}` : undefined}
				/>
				{(isIVideoFile(file) || isIFolderFile(file)) && (
					<CardContent>
						<Stack direction={'column'} spacing={1}>
							{isIVideoFile(file) && (
								<div style={{ display: 'flex', gap: 5 }}>
									<Chip
										size={'small'}
										icon={<HourglassFull />}
										label={<TimeDisplay time={new Signal(file.duration)} />}
									/>
									<Chip
										size={'small'}
										icon={<AspectRatio />}
										label={
											file.resolution < 720 ? 'SD'
												: file.resolution < 1080 ? 'HD'
													: file.resolution < 1440 ? 'FHD'
														: file.resolution < 2160 ? 'QHD'
															: file.resolution < 1440 ? '4k'
																: '8k'
										}
									/>
								</div>
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
