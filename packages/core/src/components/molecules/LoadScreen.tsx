import React from "react";
import { Box, Typography } from "@mui/material";
import { Loader } from "../atoms";
import { ReadonlySignal } from '@preact/signals-react';

export function LoadScreen(props: { text: string | ReadonlySignal<string>; }) {
	return (
		<Box sx={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%'
		}}>
			<Box>
				<Typography>{props.text}</Typography>
				<Loader />
			</Box>
		</Box>
	);
}
