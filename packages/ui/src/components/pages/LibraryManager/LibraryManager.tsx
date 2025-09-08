import { Button, Paper, Toolbar } from '@mui/material';
import { IGlobalSearchService, IGlobalSearchServiceSymbol } from 'ipmc-core';
import { IIndexManager, IIndexManagerSymbol, IProfile, IProfileSymbol } from "ipmc-interfaces";
import React from "react";
import { LibraryFilters } from 'src/components/molecules/LibraryFilters';
import { Redirect, Route } from 'wouter';
import { useService } from '../../../context/AppContext';
import { usePersistentSignal, useTranslation } from '../../../hooks';
import { Display, ErrorBoundary, GlobalSearchField } from '../../molecules';
import { LibraryDrawer, MediaPlayer } from '../../organisms';
import { ItemRouter } from '../ItemRouter';
import { LibraryHomePage } from '../LibraryHomePage';
import { LibraryPage } from '../LibraryPage';
import styles from './LibraryManager.module.css';

export function LibraryManager() {
	const _t = useTranslation();
	const profile = useService<IProfile>(IProfileSymbol);
	const indexManager = useService<IIndexManager>(IIndexManagerSymbol);
	const searchService = useService<IGlobalSearchService>(IGlobalSearchServiceSymbol);
	const libraries = profile.libraries;

	const display = usePersistentSignal<Display>(Display.Poster, 'display');

	return (
		<div className={styles.container}>
			<div className={styles.contentContainer}>
				<Paper elevation={1} sx={{ borderRadius: 0 }}>
					<Toolbar>
						<LibraryDrawer />
						<Route path={'/:library/:item'} nest>
							<Button
								onClick={() => history.back()}
							>
								{_t('Back')}
							</Button>
						</Route>
						<GlobalSearchField searchService={searchService} />
						<LibraryFilters display={display} />
					</Toolbar>
				</Paper>
				<div className={styles.content}>
					<Route path={'/'}>
						<ErrorBoundary>
							<LibraryHomePage />
						</ErrorBoundary>
					</Route>
					<Route path={'/:library'} nest>
						{(params) => {
							if (libraries.some(l => l.id === params.library)) {
								const items = indexManager.indexes.get(params.library)!;
								return (
									<ErrorBoundary>
										<Route path={'/'}>
											<LibraryPage key={params.library} library={params.library} />
										</Route>
										<ErrorBoundary>
											{items.value && <ItemRouter items={items.value.index} />}
										</ErrorBoundary>
									</ErrorBoundary>
								);
							}
							return (
								<Redirect to='~/' />
							);
						}}
					</Route>
				</div>
				<MediaPlayer />
			</div>
		</div>
	);
}
