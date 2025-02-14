import { CircularProgress } from "@mui/material";

const normalise = (value?: number, max: number = 100) => value ? (value * 100) / max : undefined;

export function Loader(props: { progress?: number, total?: number; }) {
	return (
		<CircularProgress variant={props.progress ? 'determinate' : 'indeterminate'} value={normalise(props.progress, props.total)} />
	);
}
