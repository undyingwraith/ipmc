import { Card, CardContent, CardMedia } from "@mui/material";
import React from "react";
import { useFileUrl } from "../../../hooks";
import { ISeriesMetaData } from "../../../service";
import fallback from './no-poster.png';

export function SeriesPosterGridItem(props: { serie: ISeriesMetaData; }) {
	const url = useFileUrl(props.serie.posters[0]?.cid, fallback);

	return (
		<Card sx={{ width: 240 }}>
			<CardMedia image={url} sx={{ height: 360, width: 240 }} />
			<CardContent>{props.serie.title}</CardContent>
		</Card>
	);
}
