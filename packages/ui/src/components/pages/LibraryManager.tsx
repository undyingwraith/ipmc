import HomeIcon from '@mui/icons-material/Home';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import MovieIcon from '@mui/icons-material/Movie';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack } from '@mui/material';
import { Signal, useComputed, useSignal } from "@preact/signals-react";
import { IProfile, IProfileSymbol } from "ipmc-interfaces";
import React from "react";
import { Redirect, Route, useLocation } from 'wouter';
import { useService } from '../../context/AppContext';
import { useLinkedSignal, useTranslation } from '../../hooks';
import { ErrorBoundary } from '../atoms/ErrorBoundary';
import { Library } from '../organisms/Library';
import { LibraryAppBar } from "../organisms/LibraryAppBar";
import { LibraryHomeScreen } from '../organisms/LibraryHomeScreen';

const icons = {
	movie: <MovieIcon />,
	series: <LiveTvIcon />,
	music: <MusicNoteIcon />,
} as { [key: string]: any; };

export function LibraryManager() {
	const profile = useService<IProfile>(IProfileSymbol);
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
						selected={location.value === '/' + lib.id}
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
		<Stack direction={"row"} sx={{ flexGrow: 1, width: '100vw', height: '100%', overflow: 'hidden' }}>
			<Paper sx={{ width: '25vw', flexShrink: 0 }}>
				{sidebar}
			</Paper>
			<Box sx={{ flexGrow: 1 }}>
				<Stack sx={{ maxHeight: '100%', height: '100%', overflow: 'hidden' }}>
					<LibraryAppBar display={display} query={query} />
					<Box sx={{ overflow: 'auto', flexGrow: 1 }}>
						<Route path={'/'}>
							<ErrorBoundary>
								<LibraryHomeScreen />
							</ErrorBoundary>
						</Route>
						<Route path={'/:library'}>
							{(params) => libraries.some(l => l.id === params.library) ? (
								<ErrorBoundary>
									<Library key={params.library} display={display} library={params.library} query={query} />
								</ErrorBoundary>
							) : (
								<Redirect to='/' />
							)}
						</Route>
					</Box>
				</Stack>
			</Box>
		</Stack>
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
