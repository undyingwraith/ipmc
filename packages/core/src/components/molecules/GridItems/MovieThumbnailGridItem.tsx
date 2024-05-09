import React from "react";
import { Card, CardContent, CardMedia } from "@mui/material";
import { IMovieMetaData } from "../../../service";
import { useFileUrl } from "../../../hooks";
import fallback from './no-thumbnail.png';

export function MovieThumbnailGridItem(props: { movie: IMovieMetaData }) {
	const url = useFileUrl(props.movie.thumbnails[0]?.cid, fallback);

	return (
		<Card sx={{ width: 640 }}>
			<CardMedia image={url} sx={{ height: 360, width: 640 }} />
			<CardContent>{props.movie.title}</CardContent>
		</Card>
	);
}
