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

	const status = useComputed(() => {
		const status = taskManager.status.value;
		if (status.length > 0) {
			return (
				<Card>
					<CardHeader title={_t('ActiveTasks')} />
					{taskManager.status.value.map(t => (
						<CardContent>
							<Stack direction={"row"} gap={1}>
								<Loader progress={t.progress} total={t.total} />
								<Typography>{t.title}</Typography>
							</Stack>
						</CardContent>
					))}
				</Card>
			);
		} else {
			return undefined;
		}
	});

	return (<Box>
		<Typography>{_t('Home')}</Typography>
		{status}
	</Box>);
}
