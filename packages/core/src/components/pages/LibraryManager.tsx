import React from "react";
import { ILibrary, IMovieLibrary/*, IGenericMetaData*/ } from "../../service";
import { Signal, useComputed, useSignal } from "@preact/signals-react";
import { useApp } from "./AppContext";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import HomeIcon from '@mui/icons-material/Home';
import { useTranslation } from "react-i18next";
import { MovieLibrary } from "../organisms/MovieLibrary";
import { LibraryAppBar } from "../organisms/LibraryAppBar";

// Icons
import MovieIcon from '@mui/icons-material/Movie';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const icons = {
	movie: <MovieIcon />,
	series: <LiveTvIcon />,
	music: <MusicNoteIcon />,
} as { [key: string]: any }

export function LibraryManager() {
	const { profile } = useApp();
	const [_t] = useTranslation();
	const libraries = profile.libraries;
	const library = useSignal<ILibrary | undefined>(undefined);
	const display = useSignal<Display>(Display.Poster);
	const query = useSignal<string>('');

	const content = useComputed(() => {
		if (library.value == undefined) {
			return (<Box>Home</Box>);
		} else {
			return (
				<Stack sx={{ height: '100%' }}>
					<LibraryAppBar display={display} query={query} />
					<Box sx={{ overflow: 'auto', flexShrink: 1, flexGrow: 1 }}>
						<MovieLibrary
							display={display}
							library={library.value as IMovieLibrary}
						/>
					</Box>
				</Stack>
			);
		}
	});

	return <Stack direction={"row"} sx={{ height: '100%' }}>
		<Paper sx={{ width: '25vw', flexShrink: 0 }}>
			<List>
				<ListItem disablePadding>
					<ListItemButton onClick={() => {
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
						<ListItemButton onClick={() => {
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
		</Paper>
		<Box sx={{ flexGrow: 1 }}>
			{content}
		</Box>
	</Stack>
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
