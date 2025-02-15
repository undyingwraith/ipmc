import HomeIcon from '@mui/icons-material/Home';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import MovieIcon from '@mui/icons-material/Movie';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { useComputed } from "@preact/signals";
import { IIndexManager, IIndexManagerSymbol, IProfile, IProfileSymbol } from "ipmc-interfaces";
import { Redirect, Route, useLocation } from 'wouter-preact';
import { AppContextProvider, useService } from '../../../context/AppContext';
import { useLinkedSignal, useTranslation } from '../../../hooks';
import { AppbarButtonService, AppbarButtonServiceSymbol } from '../../../services';
import { ErrorBoundary } from '../../atoms/ErrorBoundary';
import { AppBar } from '../../organisms';
import { ItemRouter } from '../ItemRouter';
import { LibraryHomePage } from '../LibraryHomePage';
import { LibraryPage } from '../LibraryPage';
import styles from './LibraryManager.module.css';

const icons = {
	movie: <MovieIcon />,
	series: <LiveTvIcon />,
	music: <MusicNoteIcon />,
} as { [key: string]: any; };

export function LibraryManager() {
	const profile = useService<IProfile>(IProfileSymbol);
	const indexManager = useService<IIndexManager>(IIndexManagerSymbol);
	const _t = useTranslation();
	const libraries = profile.libraries;
	const [loc, setLocation] = useLocation();
	const location = useLinkedSignal(loc);

	const sidebar = useComputed(() => (
		<List>
			<ListItem disablePadding>
				<ListItemButton
					selected={location.value === '/'}
					onClick={() => {
						setLocation('/');
					}}>
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<ListItemText primary={_t('Home')} />
				</ListItemButton>
			</ListItem>
			{libraries.map((lib) => (
				<ListItem key={lib.name} disablePadding>
					<ListItemButton
						selected={location.value.startsWith('/' + lib.id)}
						onClick={() => {
							setLocation('/' + lib.id);
						}}>
						<ListItemIcon>
							{icons[lib.type] ?? <QuestionMarkIcon />}
						</ListItemIcon>
						<ListItemText primary={lib.name} />
					</ListItemButton>
				</ListItem>
			))}
		</List>
	));

	return (
		<div className={styles.container}>
			<Paper className={styles.sidebar} sx={{ borderRadius: 0 }}>
				{sidebar}
			</Paper>
			<div className={styles.contentContainer}>
				<AppContextProvider
					setup={(app) => {
						app.register(AppbarButtonService, AppbarButtonServiceSymbol);
					}}
				>
					<AppBar elevation={1} />
					<div className={styles.content}>
						<Route path={'/'}>
							<ErrorBoundary>
								<LibraryHomePage />
							</ErrorBoundary>
						</Route>
						<Route path={'/:library'} nest>
							{(params: { library: string; }) => {
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
				</AppContextProvider>
			</div>
		</div>
	);
}
