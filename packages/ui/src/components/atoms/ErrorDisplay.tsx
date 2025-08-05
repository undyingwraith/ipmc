import { Alert, Typography } from '@mui/material';
import React from 'react';

export function ErrorDisplay(props: { error: Error; }) {
	const { error } = props;

	return (
		<Alert severity={'error'}>
			<Typography data-testid={'error-message'}>{error.name}: {error.message}</Typography>
		</Alert>
	);
}
