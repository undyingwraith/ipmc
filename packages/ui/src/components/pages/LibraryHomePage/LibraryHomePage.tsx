import { Card, CardActionArea, CardContent, CardHeader, Typography } from '@mui/material';
import { Signal, useComputed } from '@preact/signals-react';
import { IPinItem, IPinManagerService, IPinManagerServiceSymbol, IProfile, IProfileSymbol, ITaskManager, ITaskManagerSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useLocation } from 'wouter';
import { useService } from '../../../context';
import { LibraryTypeDictionary } from '../../../dictionaries';
import { useTranslation } from '../../../hooks/useTranslation';
import { ISortAndFilterService, ISortAndFilterServiceSymbol } from '../../../services';
import { ProcessDisplay } from '../../atoms';
import { Display } from '../../molecules';
import { FileGridItem } from '../../molecules/FileGridItem';
import styles from './LibraryHomePage.module.css';

export function LibraryHomePage() {
	const _t = useTranslation();
	const [_, setLocation] = useLocation();
	const taskManager = useService<ITaskManager>(ITaskManagerSymbol);
	const pinManager = useService<IPinManagerService>(IPinManagerServiceSymbol);
	const profile = useService<IProfile>(IProfileSymbol);
	const sortAndFilterService = useService<ISortAndFilterService>(ISortAndFilterServiceSymbol);

	const status = useComputed(() => {
		const status = taskManager.status.value;
		if (status.length > 0) {
			return (
				<Card>
					<CardHeader title={_t('ActiveTasks')} />
					<CardContent>
						{status.map(t => (<ProcessDisplay task={t} />))}
					</CardContent>
				</Card>
			);
		} else {
			return undefined;
		}
	});

	return (
		<div className={styles.container}>
			<h1>{_t('Home')}</h1>
			<div>
				<h2>{_t('Libraries')}</h2>
				<div className={styles.carousel}>
					{profile.libraries.map(l => (
						<Card key={l.id} className={styles.library}>
							<CardActionArea onClick={() => setLocation(`/${l.id}`)}>
								<CardContent className={styles.iconContainer}>
									{LibraryTypeDictionary[l.type] ?? LibraryTypeDictionary.unknown}
								</CardContent>
								<CardHeader title={l.name} />
							</CardActionArea>
						</Card>
					))}
				</div>
			</div>
			{status}
			{pinManager.pins.value.length > 0 && (
				<div>
					<h2>{_t('Favorites')}</h2>
					<div>
						{Object.entries(Object.groupBy(pinManager.pins.value, (i) => i.itemId.substring(0, i.itemId.indexOf('/'))))
							.map(([cat, items]: [string, IPinItem[]]) => (
								<div>
									<Typography variant={'h6'}>{profile.libraries.find(l => l.id === cat)?.name ?? cat}</Typography>
									<div className={styles.carousel}>
										{sortAndFilterService.createQueryList(items.map(p => pinManager.resolvePin(p)).filter(p => p !== undefined)).map(p => (
											<FileGridItem file={p} onOpen={() => setLocation(p.pinId)} display={new Signal(Display.Poster)} />
										))}
									</div>
								</div>
							))
						}
					</div>
				</div>
			)}
		</div>
	);
}
