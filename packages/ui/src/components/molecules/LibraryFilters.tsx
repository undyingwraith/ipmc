import { Remove, Tune } from '@mui/icons-material';
import { Button, Drawer, IconButton } from '@mui/material';
import { computed, Signal, useComputed, useSignal } from '@preact/signals-react';
import React from 'react';
import { useService } from '../../context';
import { useHotkey } from '../../hooks';
import { IFilter, ISortAndFilterService, ISortAndFilterServiceSymbol } from '../../services';
import { DropDown } from '../atoms/DropDown';
import { Display, DisplayButtons } from './DisplayButtons';

export function LibraryFilters(props: { display: Signal<Display>; }) {
	const sortAndFilterService = useService<ISortAndFilterService>(ISortAndFilterServiceSymbol);
	const filters: IFilter[] = sortAndFilterService.filters;
	const activeFilters = sortAndFilterService.activeFilters;

	const drawerOpen = useSignal(false);

	function toggle() {
		drawerOpen.value = !drawerOpen.peek();
	}

	useHotkey({
		key: 'f',
		ctrl: true,
		shift: true,
	}, toggle);

	return (<>
		<IconButton onClick={toggle}>
			<Tune />
		</IconButton>
		{useComputed(() => (
			<Drawer open={drawerOpen.value} onClose={toggle} anchor='right'>
				<DisplayButtons display={props.display} />
				<DropDown icon={<Tune />} text={'Add filter'}>
					{computed(() => {
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
					{computed(() => activeFilters.value.map((f) => (
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
			</Drawer>
		))}
	</>);
}
