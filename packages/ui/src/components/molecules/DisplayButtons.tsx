import { Button, ButtonGroup } from '@mui/material';
import { useComputed } from '@preact/signals-react';
import React from 'react';
import { TDisplay } from 'src/services/LibraryService/TDisplay';
import { useService } from '../../context';
import { useTranslation } from '../../hooks';
import { ILibraryCapabilities, ILibraryService, ILibraryServiceSymbol } from '../../services';

// Icons
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

export function DisplayButtons() {
	const _t = useTranslation();
	const libraryService = useService<ILibraryService>(ILibraryServiceSymbol);
	const display = libraryService.display;

	const capabilities = useComputed<ILibraryCapabilities>(() => {
		const active = libraryService.active.value;
		return active ? libraryService.getCapabilities(active.library) : {
			displays: [],
			hasPoster: false,
			hasThumbnail: false,
			views: undefined,
		};
	});

	return useComputed(() => (
		<ButtonGroup>
			{capabilities.value.displays.includes(TDisplay.Poster) && (
				<Button
					onClick={() => display.value = TDisplay.Poster}
					variant={display.value == TDisplay.Poster ? 'contained' : 'outlined'}
					title={_t('DisplayPoster').value}
				>
					<ViewModuleIcon />
				</Button>
			)}
			{capabilities.value.displays.includes(TDisplay.Thumbnail) && (
				<Button
					onClick={() => display.value = TDisplay.Thumbnail}
					variant={display.value == TDisplay.Thumbnail ? 'contained' : 'outlined'}
					title={_t('DisplayThumbnail').value}
				>
					<GridViewIcon />
				</Button>
			)}
			{capabilities.value.displays.includes(TDisplay.List) && (
				<Button
					onClick={() => display.value = TDisplay.List}
					variant={display.value == TDisplay.List ? 'contained' : 'outlined'}
					title={_t('DisplayList').value}
				>
					<ViewListIcon />
				</Button>
			)}
		</ButtonGroup>
	));
}
