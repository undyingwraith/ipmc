import { Button, Card, CardActions, CardContent, CardMedia } from "@mui/material";
import React from "react";
import { useFileUrl } from "../../../hooks";
import { ISeriesMetaData } from "../../../service";
import fallback from './no-poster.png';
import { PinButton } from '../../atoms/PinButton';

export function SeriesPosterGridItem(props: { serie: ISeriesMetaData; onOpen: () => void; }) {
	const url = useFileUrl(props.serie.posters[0]?.cid, fallback);

	return (
		<Card sx={{ width: 240 }}>
			<CardMedia image={url} sx={{ height: 360, width: 240 }} />
			<CardContent>{props.serie.title}</CardContent>
			<CardActions>
				<PinButton cid={props.serie.cid} />
				<Button onClick={props.onOpen}>Play</Button>
			</CardActions>
		</Card>
	);
}
