import { Paper, Toolbar } from "@mui/material";
import React from "react";

export function AppBar(props: {
	elevation?: number;
	children: any;
}) {
	return (
		<Paper elevation={props.elevation ?? 1} sx={{ borderRadius: 0 }}>
			<Toolbar>
				{props.children}
			</Toolbar>
		</Paper>
	);
}
