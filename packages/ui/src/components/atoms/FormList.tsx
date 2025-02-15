import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Signal } from '@preact/signals';
import { VNode } from 'preact';
import { useTranslation } from '../../hooks';

interface IFormListProps<TData> {
	renderControl: (data: Signal<TData>) => VNode<any>;
	values: Signal<Signal<TData>[]>;
	createItem: () => TData;
	label: string;
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
			{props.values.value.map((item, index) => (
				<Grid size={12}>
					{props.renderControl(item)}
					<Button onClick={() => {
						props.values.value = props.values.value.toSpliced(index, 1);
					}}>{_t('Remove')}</Button>
				</Grid>
			))}
		</Grid>
	);
}
