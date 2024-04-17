import React from "react";
import { Card, CardContent, CardMedia } from "@mui/material";
import { IMovieMetaData } from "../../../service";
import { useFileUrl } from "../../../hooks";

export function MovieThumbnailGridItem(props: { movie: IMovieMetaData }) {
	const url = useFileUrl(props.movie.thumbnails[0]?.cid);

	return (
		<Card sx={{ width: 640 }}>
			<CardMedia image={url} sx={{ height: 360, width: 640 }} />
			<CardContent>{props.movie.title}</CardContent>
		</Card>
	);
}
