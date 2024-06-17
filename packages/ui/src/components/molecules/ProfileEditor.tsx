import React from 'react';
import { useComputed, useSignal } from "@preact/signals-react";
import { Button, Card, CardActions, CardContent, CardHeader, TextField } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { IConfigurationService } from 'ipmc-interfaces';

export function ProfileEditor(props: { id: string, configService: IConfigurationService, onCancel: () => void, onSave: () => void; }) {
	const { configService, id, onCancel, onSave } = props;
	const [_t] = useTranslation();

	const profile = useComputed(() => {
		return configService.getProfile(id);
	});

	const name = useSignal<string>(profile.value?.name ?? id);

	function save() {
		configService.setProfile(id, {
			...(profile.value ?? {}),
			name: name.value,
		});
		onSave();
	}

	return (
		<Card>
			<CardHeader title={_t('EditProfile')} />
			<CardContent>
				<TextField
					label={_t('Name')}
					value={name}
					onChange={(ev) => {
						name.value = ev.target.value;
					}}
				/>
			</CardContent>
			<CardActions>
				<Button onClick={() => onCancel()}>{_t('Cancel')}</Button>
				<Button onClick={() => save()}>{_t('Save')}</Button>
			</CardActions>
		</Card>
	);
}
