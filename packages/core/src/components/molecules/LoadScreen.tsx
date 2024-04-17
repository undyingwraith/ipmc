import React from "react";
import { Box, Typography } from "@mui/material";
import { Loader } from "../atoms";

export function LoadScreen(props: { text: string }) {
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
