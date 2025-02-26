import { Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Signal, useComputed, useSignal } from '@preact/signals-react';
import { uuid } from 'ipmc-core';
import { IConfigurationService, IConfigurationServiceSymbol, ILibrary, IProfile, isInternalProfile, isRemoteProfile } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context';
import { useTranslation } from '../../hooks';
import { FormList, SelectInput, TextInput } from '../atoms';
import { LibraryEditor } from './LibraryEditor';

export function ProfileEditor(props: { profile: IProfile, onCancel: () => void, onSave: () => void; }) {
	const { profile, onCancel, onSave } = props;
	const configService = useService<IConfigurationService>(IConfigurationServiceSymbol);
	const _t = useTranslation();

	const name = useSignal<string>(profile.name);
	const type = useSignal<'internal' | 'remote'>(profile.type ?? 'internal');
	const apiUrl = useSignal<string>(isRemoteProfile(profile) ? profile.url ?? '' : '');
	const swarmKey = useSignal<string>(isInternalProfile(profile) ? profile.swarmKey ?? '' : '');
	const port = useSignal<string>(isInternalProfile(profile) ? profile.port?.toString() ?? '' : '');
	const bootstrap = useSignal<Signal<string>[]>(isInternalProfile(profile) ? profile.bootstrap?.map(i => new Signal(i)) ?? [] : []);
	const libraries = useSignal<Signal<ILibrary>[]>(profile.libraries.map(i => new Signal(i)));

	function save() {
		configService.setProfile(profile.id, {
			...(profile ?? {}),
			name: name.value,
			type: type.value,
			...(type.value === 'internal' ? {
				swarmKey: swarmKey.value === '' ? undefined : swarmKey.value,
				port: port.value === '' ? undefined : parseInt(port.value),
				bootstrap: bootstrap.value.map(s => s.value),
			} : {
				apiUrl: apiUrl.value === '' ? undefined : apiUrl.value,
			}),
			libraries: libraries.value.map(l => l.value),
		});
		onSave();
	}

	return (
		<Card sx={{ maxHeight: '100%', overflow: 'auto' }}>
			<CardHeader title={_t('EditProfile')} />
			<CardContent>
				<Grid container spacing={2}>
					<Grid size={8}>
						<TextInput
							label={_t('Name')}
							value={name}
						/>
					</Grid>
					<Grid size={4}>
						<SelectInput
							value={type}
							label={_t('ProfileType')}
							options={{
								'internal': _t('Internal'),
								'remote': _t('Remote'),
							}}
						/>
					</Grid>
					{useComputed(() => type.value === 'internal' ? (<>
						<Grid size={12}>
							<TextInput
								label={_t('SwarmKey')}
								value={swarmKey}
								key={'swarmKey'}
								multiline={true}
								rows={3}
							/>
						</Grid>
						<Grid size={12}>
							<TextInput
								label={_t('Port')}
								value={port}
								key={'port'}
							/>
						</Grid>
						<Grid size={12}>
							<FormList
								label={_t('Bootstrap')}
								values={bootstrap}
								renderControl={(item) => (
									<TextInput
										value={item}
									/>
								)}
								createItem={() => ''}
							/>
						</Grid>
					</>) : (<>
						<Grid size={12}>
							<TextInput
								label={_t('ApiUrl')}
								value={apiUrl}
								key={'apiUrl'}
							/>
						</Grid>
					</>))}
					<Grid size={12}>
						<FormList
							label={_t('Libraries')}
							values={libraries}
							renderControl={(item) => (
								<LibraryEditor
									value={item}
								/>
							)}
							createItem={() => ({
								id: uuid(),
								upstream: '',
								name: '',
								type: 'movie',
							} as ILibrary)}
						/>
					</Grid>
				</Grid>
			</CardContent>
			<CardActions>
				<Button onClick={() => onCancel()}>{_t('Cancel')}</Button>
				<Button onClick={() => save()}>{_t('Save')}</Button>
			</CardActions>
		</Card>
	);
}
