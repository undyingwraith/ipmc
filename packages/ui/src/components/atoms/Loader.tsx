import { CircularProgress } from "@mui/material";
import React from "react";

const normalise = (value?: number, max: number = 100) => value ? (value / max) * 100 : undefined;

export function Loader(props: { progress?: number, total?: number; size?: number; }) {
	return (
		<CircularProgress
			variant={props.progress ? 'determinate' : 'indeterminate'}
			value={normalise(props.progress, props.total)}
			size={props.size}
		/>
	);
}
