import { Button, ButtonGroup } from '@mui/material';
import { Signal, useComputed } from '@preact/signals-react';
import React from 'react';
import { useService } from '../../context';
import { useTranslation } from '../../hooks';
import { ILibraryCapabilities, ILibraryService, ILibraryServiceSymbol } from '../../services';

// Icons
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

export enum Display {
	Poster,
	Thumbnail,
	List,
}

export function DisplayButtons(props: { display: Signal<Display>; }) {
	const { display } = props;
	const _t = useTranslation();
	const libraryService = useService<ILibraryService>(ILibraryServiceSymbol);

	const capabilities = useComputed<ILibraryCapabilities>(() => {
		const active = libraryService.active.value;
		return active ? libraryService.getCapabilities(active.library) : {
			hasPoster: false,
			hasThumbnail: false,
			views: undefined,
		};
	});

	return useComputed(() => (
		<ButtonGroup>
			{capabilities.value.hasPoster && (
				<Button
					onClick={() => display.value = Display.Poster}
					variant={display.value == Display.Poster ? 'contained' : 'outlined'}
					title={_t('DisplayPoster').value}
				>
					<ViewModuleIcon />
				</Button>
			)}
			{capabilities.value.hasThumbnail && (
				<Button
					onClick={() => display.value = Display.Thumbnail}
					variant={display.value == Display.Thumbnail ? 'contained' : 'outlined'}
					title={_t('DisplayThumbnail').value}
				>
					<GridViewIcon />
				</Button>
			)}
			<Button
				onClick={() => display.value = Display.List}
				variant={display.value == Display.List ? 'contained' : 'outlined'}
				title={_t('DisplayList').value}
			>
				<ViewListIcon />
			</Button>
		</ButtonGroup>
	));
}
