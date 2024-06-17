import React, { PropsWithChildren } from 'react';
import { Backdrop } from '@mui/material';

export function DetailOverlay(props: PropsWithChildren<{}>) {
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
