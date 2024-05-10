import React from "react";
import { IMovieMetaData } from "../../../service";
import { Card, CardContent, CardMedia } from "@mui/material";
import { useFileUrl, useWatcher } from "../../../hooks";
import fallback from './no-poster.png';
import { Signal } from '@preact/signals-react';
import { Display } from '../../pages/LibraryManager';
import { useComputed } from '@preact/signals-react';

export function MovieGridItem(props: { movie: IMovieMetaData, display: Signal<Display>; }) {
	const { movie, display } = props;
	const url = useWatcher(useFileUrl(props.movie.posters[0]?.cid, fallback));
	const width = useComputed(() => display.value == Display.Poster ? 240 : 640);
	const height = useComputed(() => display.value == Display.Poster ? 360 : 360);

	return useComputed(() => (
		<Card sx={{ width: width.value }}>
			<CardMedia image={url.value} sx={{ height: height.value, width: width.value }} />
			<CardContent>{movie.title}</CardContent>
		</Card>
	));
}
