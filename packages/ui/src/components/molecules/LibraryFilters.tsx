import { Tune } from '@mui/icons-material';
import React from 'react';
import { DropDown } from '../atoms/DropDown';
import { DisplayButtons } from './DisplayButtons';

export function LibraryFilters() {
	return <DropDown icon={<Tune />} align={'right'}>
		<DisplayButtons />
	</DropDown>;
}
