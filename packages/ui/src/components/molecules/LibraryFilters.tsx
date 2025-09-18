import { Remove, Tune } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { Signal, useComputed } from '@preact/signals-react';
import React from 'react';
import { useService } from '../../context';
import { IFilter, ISortAndFilterService, ISortAndFilterServiceSymbol } from '../../services';
import { DropDown } from '../atoms/DropDown';
import { Display, DisplayButtons } from './DisplayButtons';

export function LibraryFilters(props: { display: Signal<Display>; }) {
	const sortAndFilterService = useService<ISortAndFilterService>(ISortAndFilterServiceSymbol);
	const filters: IFilter[] = sortAndFilterService.filters;
	const activeFilters = sortAndFilterService.activeFilters;

	return <DropDown icon={<Tune />} align={'right'}>
		<DisplayButtons display={props.display} />
		<DropDown icon={<Tune />} text={'Add filter'}>
			{useComputed(() => {
				const active = activeFilters.value;
				return filters.filter(f => !active.includes(f)).map(f => (
					<Button
						onClick={() => {
							activeFilters.value = [...activeFilters.value, f];
						}}
					>{f.name}</Button>
				));
			})}
		</DropDown>
		<div>
			{useComputed(() => activeFilters.value.map((f) => (
				<div>
					{f.name}
					<div>
						{f.render()}
					</div>
					<IconButton
						onClick={() => activeFilters.value = activeFilters.value.filter(ff => ff != f)}
					>
						<Remove />
					</IconButton>
				</div>
			)))}
		</div>
	</DropDown>;
}
