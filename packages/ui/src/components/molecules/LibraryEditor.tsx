import Grid from '@mui/material/Grid2';
import { Signal, useSignal } from '@preact/signals-react';
import { useTranslation } from '@src/hooks';
import { ILibrary } from 'ipmc-interfaces';
import React, { useEffect } from 'react';
import { SelectInput, TextInput } from '../atoms';

interface ILibraryEditorProps {
	value: Signal<ILibrary>;
}

export function LibraryEditor(props: ILibraryEditorProps) {
	const _t = useTranslation();

	const name = useSignal<string>(props.value.value.name);
	const type = useSignal<'movie' | 'series' | 'music'>(props.value.value.type);
	const upstream = useSignal<string>(props.value.value.upstream ?? '');

	useEffect(() => {
		name.subscribe((value) => {
			props.value.value = { ...props.value.value, name: value };
		});
		type.subscribe((value) => {
			props.value.value = { ...props.value.value, type: value };
		});
		upstream.subscribe((value) => {
			props.value.value = { ...props.value.value, upstream: value };
		});
	});

	return (
		<Grid container spacing={2}>
			<Grid size={8}>
				<TextInput
					value={name}
					label={_t('Name')}
				/>
			</Grid>
			<Grid size={4}>
				<SelectInput
					value={type}
					label={_t('Type')}
					options={{
						'movie': _t('Movies'),
						'series': _t('Series'),
						'music': _t('Music'),
					}}
				/>
			</Grid>
			<Grid size={12}>
				<TextInput
					value={upstream}
					label={_t('Upstream')}
				/>
			</Grid>
		</Grid>
	);
}
