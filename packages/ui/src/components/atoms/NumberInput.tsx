import { TextField } from '@mui/material';
import { ReadonlySignal, Signal, useComputed } from '@preact/signals-react';
import React from 'react';

export interface INumberInputProps {
	label?: ReadonlySignal<string>;
	value: Signal<number | undefined>;
	inputRef?: Signal<HTMLInputElement | null>;
	variant?: 'outlined' | 'filled' | 'standard';
	float?: boolean;
}

export function NumberInput(props: INumberInputProps) {


	return useComputed(() => {
		const textValue: string = props.value.value?.toString() ?? '';
		return (
			<TextField
				slotProps={{ htmlInput: { 'data-testid': 'content-input' } }}
				fullWidth={true}
				variant={props.variant}
				label={props.label?.value}
				value={textValue}
				inputRef={ref => {
					if (props.inputRef !== undefined) {
						props.inputRef.value = ref;
					}
				}}
				onChange={(ev) => {
					const text = ev.target.value;
					if (text === '') {
						props.value.value = undefined;
					} else {
						const value = props.float ? parseFloat(text) : parseInt(text);

						if (!Number.isNaN(value)) {
							props.value.value = value;
						}
					}
				}}
			/>
		);
	});
}
