import { Remove, Tune } from '@mui/icons-material';
import { Button, Drawer, IconButton } from '@mui/material';
import { computed, Signal, useComputed, useSignal } from '@preact/signals-react';
import React from 'react';
import { useService } from '../../context';
import { useHotkey, useTranslation } from '../../hooks';
import { IFilter, ISortAndFilterService, ISortAndFilterServiceSymbol } from '../../services';
import { DropDown } from '../atoms';
import { Display, DisplayButtons } from './DisplayButtons';
import { ErrorBoundary } from './ErrorBoundary';

export function LibraryFilters(props: { display: Signal<Display>; }) {
	const sortAndFilterService = useService<ISortAndFilterService>(ISortAndFilterServiceSymbol);
	const _t = useTranslation();
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
				<DropDown icon={<Tune />} text={_t('AddFilter')}>
					{computed(() => {
						const active = activeFilters.value;
						return (
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								{filters.filter(f => !active.includes(f)).map(f => (
									<Button
										onClick={() => {
											activeFilters.value = [...activeFilters.value, f];
										}}
									>{_t(f.name)}</Button>
								))}
							</div>
						);
					})}
				</DropDown>
				<div>
					{computed(() => activeFilters.value.length > 0 ? (
						<Button
							onClick={() => activeFilters.value = []}
						>{_t('ClearFilters')}</Button>
					) : undefined)}
					{computed(() => activeFilters.value.map((f) => (
						<div>
							<div>
								{_t(f.name)}
								<IconButton
									onClick={() => activeFilters.value = activeFilters.value.filter(ff => ff != f)}
								>
									<Remove />
								</IconButton>
							</div>
							<div>
								<ErrorBoundary>
									{f.render()}
								</ErrorBoundary>
							</div>
						</div>
					)))}
				</div>
			</Drawer>
		))}
	</>);
}
