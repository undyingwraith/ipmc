import React from 'react';
import { TextField } from '@mui/material';
import { ReadonlySignal, Signal, useComputed } from '@preact/signals-react';

interface ITextInputProps {
	label?: ReadonlySignal<string>;
	value: Signal<string>;
	inputRef?: Signal<HTMLInputElement | null>;
	multiline?: boolean;
	rows?: number;
	variant?: 'outlined' | 'filled' | 'standard';
}

export function TextInput(props: ITextInputProps) {
	return useComputed(() => (
		<TextField
			slotProps={{ htmlInput: { "data-testid": "content-input" } }}
			fullWidth={true}
			rows={props.rows}
			multiline={props.multiline}
			variant={props.variant}
			label={props.label?.value}
			value={props.value.value}
			inputRef={ref => {
				if (props.inputRef !== undefined) {
					props.inputRef.value = ref;
				}
			}}
			onChange={(ev) => {
				props.value.value = ev.target.value;
			}}
		/>
	));
}
