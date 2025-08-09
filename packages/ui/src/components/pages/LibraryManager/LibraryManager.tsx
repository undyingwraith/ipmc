import { IIndexManager, IIndexManagerSymbol, IProfile, IProfileSymbol } from "ipmc-interfaces";
import React from "react";
import { Redirect, Route } from 'wouter';
import { AppContextProvider, useService } from '../../../context/AppContext';
import { AppbarButtonService, AppbarButtonServiceSymbol } from '../../../services';
import { ErrorBoundary } from '../../molecules';
import { AppBar, LibraryDrawer } from '../../organisms';
import { ItemRouter } from '../ItemRouter';
import { LibraryHomePage } from '../LibraryHomePage';
import { LibraryPage } from '../LibraryPage';
import styles from './LibraryManager.module.css';

export function LibraryManager() {
	const profile = useService<IProfile>(IProfileSymbol);
	const indexManager = useService<IIndexManager>(IIndexManagerSymbol);
	const libraries = profile.libraries;

	return (
		<AppContextProvider
			setup={(app) => {
				app.register(AppbarButtonService, AppbarButtonServiceSymbol);
			}}
		>
			<div className={styles.container}>
				<LibraryDrawer />
				<div className={styles.contentContainer}>
					<AppBar elevation={1} />
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
											{items.value && <ItemRouter items={items.value.index} />}
										</ErrorBoundary>
									);
								}
								return (
									<Redirect to='/' />
								);
							}}
						</Route>
					</div>
				</div>
			</div>
		</AppContextProvider>
	);
}
