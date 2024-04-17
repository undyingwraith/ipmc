import React from "react";
import { IMovieMetaData } from "../../../service";
import { Card, CardContent, CardMedia } from "@mui/material";
import { useFileUrl } from "../../../hooks";

export function MoviePosterGridItem(props: { movie: IMovieMetaData }) {
	const url = useFileUrl(props.movie.posters[0]?.cid);

	return (
		<Card sx={{ width: 240 }}>
			<CardMedia image={url} sx={{ height: 360, width: 240 }} />
			<CardContent>{props.movie.title}</CardContent>
		</Card>
	);
}
