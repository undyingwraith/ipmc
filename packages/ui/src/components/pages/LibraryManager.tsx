import HomeIcon from '@mui/icons-material/Home';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import MovieIcon from '@mui/icons-material/Movie';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack } from '@mui/material';
import { Signal, useComputed, useSignal } from "@preact/signals-react";
import React from "react";
import { ILibrary } from "ipmc-interfaces";
import { LibraryAppBar } from "../organisms/LibraryAppBar";
import { useApp } from "./AppContext";
import { LibraryHomeScreen } from '../organisms/LibraryHomeScreen';
import { useTranslation } from '../../hooks/useTranslation';
import { Library } from '../organisms/Library';

const icons = {
	movie: <MovieIcon />,
	series: <LiveTvIcon />,
	music: <MusicNoteIcon />,
} as { [key: string]: any; };

export function LibraryManager() {
	const { profile } = useApp();
	const _t = useTranslation();
	const libraries = profile.profile.libraries;
	const library = useSignal<ILibrary | undefined>(undefined);
	const display = useSignal<Display>(Display.Poster);
	const query = useSignal<string>('');

	const content = useComputed(() => {
		const lib = library.value;
		let component = (<Box>Unknown Library</Box>);

		if (lib == undefined) {
			component = (<LibraryHomeScreen />);
		} else {
			component = (<Library
				display={display}
				library={lib.name}
			/>);
		}

		return (
			<Stack sx={{ maxHeight: '100%', height: '100%', overflow: 'hidden' }}>
				<LibraryAppBar display={display} query={query} />
				<Box sx={{ overflow: 'auto', flexGrow: 1 }}>
					{component}
				</Box>
			</Stack>
		);
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

	return (
		<Stack direction={"row"} sx={{ flexGrow: 1, width: '100vw', height: '100%', overflow: 'hidden' }}>
			<Paper sx={{ width: '25vw', flexShrink: 0 }}>
				{sidebar}
			</Paper>
			<Box sx={{ flexGrow: 1 }}>
				{content}
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

/*function createFilter<TData extends IGenericMetaData<string>>(query: string | undefined) {
	return (entry: TData) => true;
}*/
