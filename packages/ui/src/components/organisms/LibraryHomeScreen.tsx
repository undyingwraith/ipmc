import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

export function LibraryHomeScreen() {
	const _t = useTranslation();

	/*const status = useComputed(() => profile.tasks.value.length > 0 ? (
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
	) : undefined);*/

	return (<Box>
		<Typography>{_t('Home')}</Typography>
		{/*status*/}
	</Box>);
}
