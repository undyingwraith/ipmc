import { Box, Typography } from "@mui/material";
import { ReadonlySignal } from '@preact/signals';
import { Loader } from "../atoms";

export function LoadScreen(props: { text?: string | ReadonlySignal<string>; }) {
	const { text } = props;

	return (
		<Box sx={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%'
		}}>
			<Box>
				{text && <Typography>{text}</Typography>}
				<Loader />
			</Box>
		</Box>
	);
}
