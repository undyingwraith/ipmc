import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ReadonlySignal, Signal, useComputed } from '@preact/signals-react';
import { useTranslation } from '@src/hooks';
import React, { ReactNode } from 'react';

interface IFormListProps<TData> {
	renderControl: (data: Signal<TData>) => ReactNode;
	values: Signal<Signal<TData>[]>;
	createItem: () => TData;
	label: ReadonlySignal<string>;
}

export function FormList<TData>(props: IFormListProps<TData>) {
	const _t = useTranslation();

	return (
		<Grid container spacing={1}>
			<Grid size={8}>
				<Typography>{props.label}</Typography>
			</Grid>
			<Grid size={4}>
				<Button
					fullWidth={true}
					onClick={() => {
						props.values.value = [...props.values.value, new Signal(props.createItem())];
					}}
				>
					{_t('Add')}
				</Button>
			</Grid>
			{useComputed(() => props.values.value.map((item, index) => (
				<Grid size={12}>
					{props.renderControl(item)}
					<Button onClick={() => {
						props.values.value = props.values.value.toSpliced(index, 1);
					}}>{_t('Remove')}</Button>
				</Grid>
			)))}
		</Grid>
	);
}
