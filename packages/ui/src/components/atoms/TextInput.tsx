import React from 'react';
import { TextField } from '@mui/material';
import { ReadonlySignal, Signal, useComputed } from '@preact/signals-react';

interface ITextInputProps {
	label?: ReadonlySignal<string>;
	value: Signal<string>;
	ref?: Signal<HTMLInputElement | null>;
	multiline?: boolean;
	rows?: number;
}

export function TextInput(props: ITextInputProps) {
	return useComputed(() => (
		<TextField
			fullWidth={true}
			rows={props.rows}
			multiline={props.multiline}
			label={props.label?.value}
			value={props.value.value}
			inputRef={ref => {
				if (props.ref) {
					props.ref.value = ref;
				}
			}}
			onChange={(ev) => {
				props.value.value = ev.target.value;
			}}
		/>
	));
}
