import { Box, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { useComputed } from '@preact/signals-react';
import { ITaskManager, ITaskManagerSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context';
import { useTranslation } from '../../hooks/useTranslation';
import { Loader } from '../atoms';

export function LibraryHomeScreen() {
	const _t = useTranslation();
	const taskManager = useService<ITaskManager>(ITaskManagerSymbol);

	const status = useComputed(() => taskManager.status.value.length > 0 ? (
		<Card>
			<CardHeader title={_t('ActiveTasks')} />
			{taskManager.status.value.map(t => (
				<CardContent>
					<Stack direction={"row"} gap={1}>
						<Loader />
						<Typography>{t.title}</Typography>
					</Stack>
				</CardContent>
			))}
		</Card>
	) : undefined);

	return (<Box>
		<Typography>{_t('Home')}</Typography>
		{status}
	</Box>);
}
