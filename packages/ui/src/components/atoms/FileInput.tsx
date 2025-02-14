import { Box, Button } from '@mui/material';
import { ReadonlySignal, Signal, useComputed } from '@preact/signals';
import { useTranslation } from '../../hooks';

interface IFileInputProps {
	label?: ReadonlySignal<string>;
	value: Signal<File[]>;
	accept?: string;
}

export function FileInput(props: IFileInputProps) {
	const _t = useTranslation();

	return (
		<Box>
			<Button
				variant={'contained'}
				component={'label'}
			>
				{props.label?.value ?? _t('UploadFile')}
				<input
					type={'file'}
					hidden
					accept={props.accept}
					onChange={(ev) => {
						props.value.value = Array.from(ev.currentTarget.files!);
					}}
				/>
			</Button>
			{useComputed(() => props.value.value.map((f) => (
				<Box>
					{f.name}
				</Box>
			)))}
		</Box>
	);
}
