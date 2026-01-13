import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { IGlobalSearchService, IGlobalSearchServiceSymbol } from 'ipmc-core';
import { IIndexManager, IIndexManagerSymbol, IIpfsService, IIpfsServiceSymbol, IProfile, IProfileSymbol } from "ipmc-interfaces";
import React from "react";
import { LibraryFilters } from 'src/components/molecules/LibraryFilters';
import { Redirect, Route, Switch } from 'wouter';
import { useService } from '../../../context/AppContext';
import { usePersistentSignal, useTranslation } from '../../../hooks';
import { ActiveProcessesButton, ConnectionStatus, Display, ErrorBoundary, GlobalSearchField } from '../../molecules';
import { AppBar, LibraryDrawer, MediaPlayer } from '../../organisms';
import { ItemRouter } from '../ItemRouter';
import { LibraryHomePage } from '../LibraryHomePage';
import { LibraryPage } from '../LibraryPage';
import { SettingsPage } from '../SettingsPage/SettingsPage';
import styles from './LibraryManager.module.css';

export function LibraryManager() {
	const _t = useTranslation();
	const profile = useService<IProfile>(IProfileSymbol);
	const indexManager = useService<IIndexManager>(IIndexManagerSymbol);
	const searchService = useService<IGlobalSearchService>(IGlobalSearchServiceSymbol);
	const ipfs = useService<IIpfsService>(IIpfsServiceSymbol);
	const libraries = profile.libraries;

	const display = usePersistentSignal<Display>(Display.Poster, 'display');

	return (
		<div className={styles.container}>
			<div className={styles.contentContainer}>
				<AppBar>
					<LibraryDrawer />
					<Route path={'/:library/:item'} nest>
						<Button
							onClick={() => history.back()}
							startIcon={<ArrowBack />}
						>
							{_t('Back')}
						</Button>
					</Route>
					<GlobalSearchField searchService={searchService} />
					<ActiveProcessesButton />
					<ConnectionStatus ipfs={ipfs} />
					<LibraryFilters display={display} />
				</AppBar>
				<div className={styles.content}>
					<Switch>
						<Route path={'/'}>
							<ErrorBoundary>
								<LibraryHomePage />
							</ErrorBoundary>
						</Route>
						<Route path={'/settings'}>
							<ErrorBoundary>
								<SettingsPage />
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
					</Switch>
				</div>
				<MediaPlayer />
			</div>
		</div>
	);
}
