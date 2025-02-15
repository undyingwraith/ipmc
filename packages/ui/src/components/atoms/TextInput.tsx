import { TextField } from '@mui/material';
import { Signal } from '@preact/signals';

interface ITextInputProps {
	label?: string;
	value: Signal<string>;
	inputRef?: Signal<HTMLInputElement | null>;
	multiline?: boolean;
	rows?: number;
	variant?: 'outlined' | 'filled' | 'standard';
}

export function TextInput(props: ITextInputProps) {
	return (
		<TextField
			fullWidth={true}
			rows={props.rows}
			multiline={props.multiline}
			variant={props.variant}
			label={props.label}
			value={props.value.value}
			inputRef={(ref: HTMLInputElement | null) => {
				if (props.inputRef !== undefined) {
					props.inputRef.value = ref;
				}
			}}
			onChange={(ev: any) => {
				props.value.value = ev.target.value;
			}}
		/>
	);
}
