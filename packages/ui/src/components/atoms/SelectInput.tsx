import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ReadonlySignal, Signal, useComputed } from '@preact/signals';

interface ISelectInputProps {
	label?: ReadonlySignal<string>;
	value: Signal<string>;
	options: { [key: string]: ReadonlySignal<string>; };
}

export function SelectInput(props: ISelectInputProps) {
	return (
		<FormControl fullWidth>
			<InputLabel>{props.label}</InputLabel>
			{useComputed(() => (
				<Select
					label={props.label?.value}
					value={props.value.value}
					onChange={(ev) => {
						props.value.value = ev.target.value;
					}}
				>
					{Object.entries(props.options).map(([value, label]) => (
						<MenuItem value={value}>{label}</MenuItem>
					))}
				</Select>
			))}
		</FormControl>
	);
}
