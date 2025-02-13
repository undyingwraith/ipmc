import HomeIcon from '@mui/icons-material/Home';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import MovieIcon from '@mui/icons-material/Movie';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { Signal, useComputed, useSignal } from "@preact/signals-react";
import { IIndexManager, IIndexManagerSymbol, IProfile, IProfileSymbol } from "ipmc-interfaces";
import React from "react";
import { Redirect, Route, useLocation } from 'wouter';
import { useService } from '../../../context/AppContext';
import { useLinkedSignal, useTranslation } from '../../../hooks';
import { ErrorBoundary } from '../../atoms/ErrorBoundary';
import { LibraryAppBar } from "../../organisms/LibraryAppBar";
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
	const display = useSignal<Display>(Display.Poster);
	const query = useSignal<string>('');
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
			<Paper className={styles.sidebar}>
				{sidebar}
			</Paper>
			<div className={styles.contentContainer}>
				<LibraryAppBar display={display} query={query} />
				<Box className={styles.content}>
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
											<LibraryPage key={params.library} display={display} library={params.library} query={query} />
										</Route>
										<ItemRouter items={items.value!.index} display={display} />
									</ErrorBoundary>
								);
							}
							return (
								<Redirect to='/' />
							);
						}}
					</Route>
				</Box>
			</div>
		</div>
	);
}

export enum Display {
	Poster,
	Thumbnail,
	List,
}

export interface ILibraryProps<TLib> {
	display: Signal<Display>;
	query?: string;
	library: TLib;
}
