import HomeIcon from '@mui/icons-material/Home';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import MovieIcon from '@mui/icons-material/Movie';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack } from '@mui/material';
import { Signal, useComputed, useSignal } from "@preact/signals-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { ILibrary } from "../../service";
import { isMovieLibrary } from '../../service/Library/ILibrary';
import { LibraryAppBar } from "../organisms/LibraryAppBar";
import { MovieLibrary } from "../organisms/MovieLibrary";
import { useApp } from "./AppContext";

const icons = {
	movie: <MovieIcon />,
	series: <LiveTvIcon />,
	music: <MusicNoteIcon />,
} as { [key: string]: any; };

export function LibraryManager() {
	const { profile } = useApp();
	const [_t] = useTranslation();
	const libraries = profile.profile.libraries;
	const library = useSignal<ILibrary | undefined>(undefined);
	const display = useSignal<Display>(Display.Poster);
	const query = useSignal<string>('');

	const content = useComputed(() => {
		const lib = library.value;

		if (isMovieLibrary(lib)) {
			return (
				<Stack sx={{ height: '100%' }}>
					<LibraryAppBar display={display} query={query} />
					<Box sx={{ overflow: 'auto', flexShrink: 1, flexGrow: 1 }}>
						<MovieLibrary
							display={display}
							library={lib}
						/>
					</Box>
				</Stack>
			);
		}

		if (lib == undefined) {
			return (<Box>Home</Box>);
		}

		return (<Box>Unknown Library</Box>);
	});

	const sidebar = useComputed(() => (
		<List>
			<ListItem disablePadding>
				<ListItemButton
					selected={library.value == undefined}
					onClick={() => {
						library.value = undefined;
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
						selected={library.value?.name == lib.name}
						onClick={() => {
							library.value = lib;
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

	return <Stack direction={"row"} sx={{ height: '100%' }}>
		<Paper sx={{ width: '25vw', flexShrink: 0 }}>
			{sidebar}
		</Paper>
		<Box sx={{ flexGrow: 1 }}>
			{content}
		</Box>
	</Stack>;
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

/*function createFilter<TData extends IGenericMetaData<string>>(query: string | undefined) {
	return (entry: TData) => true;
}*/
