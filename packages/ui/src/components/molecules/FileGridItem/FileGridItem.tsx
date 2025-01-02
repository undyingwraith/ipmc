import { Button, Card, CardActions, CardHeader, CardMedia } from '@mui/material';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { IFileInfo, isIVideoFile, isPosterFeature, isTitleFeature, isYearFeature } from 'ipmc-interfaces';
import React, { useRef } from 'react';
import { useFileUrl, useIsVisible, useTranslation } from '../../../hooks';
import { PinButton } from '../../atoms/PinButton';
import { Display } from '../../pages/LibraryManager';
import posterFallback from './no-poster.png';
import thumbFallback from './no-thumbnail.png';


export function FileGridItem(props: { file: IFileInfo; onOpen: () => void; display: ReadonlySignal<Display>; }) {
	const { file, display, onOpen } = props;
	const _t = useTranslation();
	const imgRef = useRef<HTMLDivElement>(null);
	const visible = useIsVisible(imgRef);

	const posterUrl = useFileUrl(isPosterFeature(file) && file.posters.length > 0 ? file.posters[0]?.cid : undefined, visible, posterFallback);
	const thumbUrl = useFileUrl(isIVideoFile(file) && file.thumbnails.length > 0 ? file.thumbnails[0]?.cid : undefined, visible, thumbFallback);
	const size = useComputed<{ width: number; height: number; }>(() => display.value == Display.Poster ? {
		width: 240,
		height: 360,
	} : {
		width: 640,
		height: 360,
	});
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
		<Card sx={{ width: size.value.width }} ref={imgRef}>
			<CardMedia image={url.value} sx={{ height: size.value.height, width: size.value.width }} />
			<CardHeader title={isTitleFeature(file) ? file.title : file.name} subheader={isYearFeature(file) ? file.year : undefined}></CardHeader>
			<CardActions>
				<PinButton cid={file.cid} />
				<Button onClick={onOpen}>{_t('Open')}</Button>
			</CardActions>
		</Card>
	));
}
