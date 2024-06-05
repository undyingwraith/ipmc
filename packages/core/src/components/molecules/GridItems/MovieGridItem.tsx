import React from "react";
import { IMovieMetaData } from "../../../service";
import { Button, Card, CardActions, CardContent, CardMedia } from "@mui/material";
import { useFileUrl, useWatcher } from "../../../hooks";
import posterFallback from './no-poster.png';
import thumbFallback from './no-thumbnail.png';
import { Signal } from '@preact/signals-react';
import { Display } from '../../pages/LibraryManager';
import { useComputed } from '@preact/signals-react';
import { PinButton } from '../../atoms/PinButton';

export function MovieGridItem(props: { movie: IMovieMetaData; display: Signal<Display>; onOpen: () => void; }) {
	const { movie, display } = props;
	const posterUrl = useWatcher(useFileUrl(props.movie.posters[0]?.cid, posterFallback));
	const thumbUrl = useWatcher(useFileUrl(props.movie.thumbnails[0]?.cid, thumbFallback));
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
			<CardContent>{movie.title}</CardContent>
			<CardActions>
				<PinButton cid={props.movie.cid} />
				<Button onClick={props.onOpen}>Play</Button>
			</CardActions>
		</Card>
	));
}
