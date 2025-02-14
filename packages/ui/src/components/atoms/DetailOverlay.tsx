import { Backdrop } from '@mui/material';
import { ComponentChildren } from 'preact';

export function DetailOverlay(props: {
	children: ComponentChildren;
}) {
	return (
		<Backdrop
			open={true}
			sx={{
				marginTop: '64px',
				width: '100vw',
				height: 'calc(100vh - 64px)',
			}}
		>
			{props.children}
		</Backdrop>
	);
}
