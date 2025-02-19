import { Alert, Box, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { Signal, useComputed } from '@preact/signals-react';
import { IPinItem, IPinManagerService, IPinManagerServiceSymbol, IProfile, IProfileSymbol, ITaskManager, ITaskManagerSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useLocation } from 'wouter';
import { useService } from '../../../context';
import { useTranslation } from '../../../hooks/useTranslation';
import { Loader } from '../../atoms';
import { FileGridItem } from '../../molecules/FileGridItem';
import { Display } from '../../molecules';
import styles from './LibraryHomePage.module.css';

export function LibraryHomePage() {
	const _t = useTranslation();
	const [_, setLocation] = useLocation();
	const taskManager = useService<ITaskManager>(ITaskManagerSymbol);
	const pinManager = useService<IPinManagerService>(IPinManagerServiceSymbol);
	const profile = useService<IProfile>(IProfileSymbol);

	const status = useComputed(() => {
		const status = taskManager.status.value;
		if (status.length > 0) {
			return (
				<Card>
					<CardHeader title={_t('ActiveTasks')} />
					{status.map(t => (
						<CardContent>
							<Stack direction={'row'} gap={1} sx={{ overflow: 'auto' }}>
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

	const pins = useComputed(() => (
		<Card>
			<CardHeader title={_t('Favorites')} />
			<CardContent>
				{pinManager.pins.value.length > 0 ?
					Object.entries(Object.groupBy(pinManager.pins.value, (i) => i.itemId.substring(0, i.itemId.indexOf('/')))).map(([cat, items]: [string, IPinItem[]]) => (
						<Box>
							<Typography variant={'h6'}>{profile.libraries.find(l => l.id === cat)?.name ?? cat}</Typography>
							<div className={styles.carousel}>
								{items.map(p => {
									const resolved = pinManager.resolvePin(p);
									return resolved ? (
										<FileGridItem file={resolved} onOpen={() => setLocation(p.itemId)} display={new Signal(Display.Poster)} />
									) : (
										<Alert severity={'error'}>
											Failed to find media.
										</Alert>
									);
								})}
							</div>
						</Box>
					)) : (
						<CardHeader title={_t('NoItems')} />
					)}
			</CardContent>
		</Card>
	));

	return (
		<Box sx={{ padding: 5, width: '100%' }}>
			<Typography variant={'h3'}>{_t('Home')}</Typography>
			<Stack spacing={1}>
				{status}
				{pins}
			</Stack>
		</Box>
	);
}
