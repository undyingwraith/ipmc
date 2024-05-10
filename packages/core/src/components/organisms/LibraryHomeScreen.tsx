import { Box, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { useComputed } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../pages/AppContext';
import React from 'react';
import { Loader } from '../atoms';

export function LibraryHomeScreen() {
	const { profile } = useApp();
	const [_t] = useTranslation();

	const status = useComputed(() => profile.tasks.value.length > 0 ? (
		<Card>
			<CardHeader title={_t('ActiveTasks')} />
			{profile.tasks.value.map(t => (
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
