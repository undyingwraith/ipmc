import { Box, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { useComputed } from '@preact/signals-react';
import React from 'react';
import { Loader } from '../atoms';
import { useTranslation } from '../../hooks/useTranslation';
import { useService } from '../../context/AppContext';
import { IProfileManager, IProfileManagerSymbol } from 'ipmc-interfaces';

export function LibraryHomeScreen() {
	const profile = useService<IProfileManager>(IProfileManagerSymbol);
	const _t = useTranslation();

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
