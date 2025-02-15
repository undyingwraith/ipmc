import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Signal } from '@preact/signals';

interface ISelectInputProps {
	label?: string;
	value: Signal<string>;
	options: { [key: string]: string; };
}

export function SelectInput(props: ISelectInputProps) {
	return (
		<FormControl fullWidth>
			<InputLabel>{props.label}</InputLabel>
			<Select
				label={props.label}
				value={props.value.value}
				onChange={(ev) => {
					props.value.value = ev.target.value;
				}}
			>
				{Object.entries(props.options).map(([value, label]) => (
					<MenuItem value={value}>{label}</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
