import { Button, ButtonGroup } from '@mui/material';
import { Signal, useComputed } from '@preact/signals-react';
import React from 'react';
import { useTranslation } from '../../hooks';

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

	return useComputed(() => (
		<ButtonGroup>
			<Button
				onClick={() => display.value = Display.Poster}
				variant={display.value == Display.Poster ? 'contained' : 'outlined'}
				title={_t('DisplayPoster').value}
			>
				<ViewModuleIcon />
			</Button>
			<Button
				onClick={() => display.value = Display.Thumbnail}
				variant={display.value == Display.Thumbnail ? 'contained' : 'outlined'}
				title={_t('DisplayThumbnail').value}
			>
				<GridViewIcon />
			</Button>
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
