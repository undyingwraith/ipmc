import React from 'react';
import posterFallback from './no-poster.png';
import thumbFallback from './no-thumbnail.png';
import { Button, Card, CardActions, CardContent, CardMedia } from '@mui/material';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { PinButton } from '../../atoms/PinButton';
import { useFileUrl, useWatcher } from '../../../hooks';
import { IFileInfo, isIVideoFile } from '../../../service';
import { Display } from '../../pages/LibraryManager';
import { isPosterFeature, isTitleFeature } from '../../../service/Library/Features';
import { useTranslation } from '../../../hooks/useTranslation';


export function FileGridItem(props: { file: IFileInfo; onOpen: () => void; display: ReadonlySignal<Display>; }) {
	const { file, display, onOpen } = props;
	const _t = useTranslation();

	const posterUrl = useWatcher(useFileUrl(isPosterFeature(file) && file.posters.length > 0 ? file.posters[0]?.cid : undefined, posterFallback));
	const thumbUrl = useWatcher(useFileUrl(isIVideoFile(file) && file.thumbnails.length > 0 ? file.thumbnails[0]?.cid : undefined, thumbFallback));
	const width = useComputed(() => display.value == Display.Poster ? 240 : 640);
	const height = useComputed(() => display.value == Display.Poster ? 360 : 360);
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
		<Card sx={{ width: width.value }}>
			<CardMedia image={url.value} sx={{ height: height.value, width: width.value }} />
			<CardContent>{isTitleFeature(file) ? file.title : file.name}</CardContent>
			<CardActions>
				<PinButton cid={file.cid} />
				<Button onClick={onOpen}>{_t('Open')}</Button>
			</CardActions>
		</Card>
	));
}
