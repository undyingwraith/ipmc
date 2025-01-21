import { AppBar, Button, ButtonGroup, Toolbar } from "@mui/material";
import { Signal, useComputed, useSignal } from "@preact/signals-react";
import React from "react";
import { useHotkey } from '../../hooks';
import { useTranslation } from '../../hooks/useTranslation';
import { Spacer, TextInput } from '../atoms';
import { Display } from "../pages/LibraryManager";

// Icons
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

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
				<TextInput
					label={_t('Search')}
					value={query}
					inputRef={searchFieldRef}
					variant={'standard'}
				/>
				<Spacer width={75} />
				{displayButtons}
			</Toolbar>
		</AppBar>
	);
}
