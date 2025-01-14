import React from "react";
import { Signal, useComputed, useSignal } from "@preact/signals-react";
import { Display } from "../pages/LibraryManager";
import { AppBar, Box, Button, ButtonGroup, TextField, Toolbar } from "@mui/material";
import { useTranslation } from '../../hooks/useTranslation';
import { useHotkey } from '../../hooks';

// Icons
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';

export function LibraryAppBar(props: { query: Signal<string>, display: Signal<Display>; }) {
	const { query, display } = props;
	const _t = useTranslation();
	const searchFieldRef = useSignal<HTMLInputElement | null>(null);
	useHotkey({
		key: 'f',
		ctrl: true,
	}, () => {
		searchFieldRef.value?.focus();
	});


	const displayButtons = useComputed(() => (
		<ButtonGroup>
			<Button
				onClick={() => display.value = Display.Poster}
				variant={display.value == Display.Poster ? 'contained' : 'outlined'}
			>
				<ViewModuleIcon />
			</Button>
			<Button
				onClick={() => display.value = Display.Thumbnail}
				variant={display.value == Display.Thumbnail ? 'contained' : 'outlined'}
			>
				<GridViewIcon />
			</Button>
			<Button
				onClick={() => display.value = Display.List}
				variant={display.value == Display.List ? 'contained' : 'outlined'}
			>
				<ViewListIcon />
			</Button>
		</ButtonGroup>
	));

	return (
		<AppBar position={'relative'}>
			<Toolbar>
				{useComputed(() => (
					<TextField
						label={_t('Search')}
						variant="standard"
						size="small"
						value={query.value}
						inputRef={(ref) => searchFieldRef.value = ref}
						onChange={(e) => query.value = e.target.value}
					/>
				))}
				<Box sx={{ flexGrow: 1 }} />
				{displayButtons}
			</Toolbar>
		</AppBar>
	);
}
