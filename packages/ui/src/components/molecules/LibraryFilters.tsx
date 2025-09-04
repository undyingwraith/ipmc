import { Tune } from '@mui/icons-material';
import { Signal } from '@preact/signals-react';
import React from 'react';
import { DropDown } from '../atoms/DropDown';
import { Display, DisplayButtons } from './DisplayButtons';

export function LibraryFilters(props: { display: Signal<Display>; }) {
	return <DropDown icon={<Tune />} align={'right'}>
		<DisplayButtons display={props.display} />
	</DropDown>;
}
