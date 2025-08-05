import { Stack, Typography } from '@mui/material';
import { ITaskStatus } from 'ipmc-interfaces';
import React from 'react';
import { Loader } from './Loader';

export function ProcessDisplay(props: { task: ITaskStatus; }) {
	const { task } = props;

	return (
		<Stack direction={'row'} gap={1} sx={{ alignItems: 'center' }}>
			<Loader progress={task.progress} total={task.total} />
			<Typography>{task.title}</Typography>
		</Stack>
	);
}
