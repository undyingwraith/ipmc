import { Box, Button, ButtonGroup, Card, CardActions, CardHeader, Container, Stack } from "@mui/material";
import { useComputed, useSignal } from "@preact/signals-react";
import { useService } from '../../context';
import { uuid } from 'ipmc-core';
import { IConfigurationService, IConfigurationServiceSymbol, IDialogService, IDialogServiceSymbol, IFileExportService, IFileExportServiceSymbol, IPopupService, IPopupServiceSymbol, IProfile } from 'ipmc-interfaces';
import React from "react";
import { useTranslation } from '../../hooks/useTranslation';
import { ProfileEditor } from "./ProfileEditor";

export function ProfileSelector(props: { profile?: IProfile, switchProfile: (name: string) => void; }) {
	const _t = useTranslation();
	const fileExportService = useService<IFileExportService>(IFileExportServiceSymbol);
	const popupService = useService<IPopupService>(IPopupServiceSymbol);
	const dialogService = useService<IDialogService>(IDialogServiceSymbol);
	const configService = useService<IConfigurationService>(IConfigurationServiceSymbol);

	const profiles = useSignal<(IProfile & { id: string; })[]>(loadProfiles());

	function loadProfiles() {
		return configService.getProfiles().map(p => ({
			...configService.getProfile(p),
			id: p,
		}));
	}

	const content = useComputed(() => profiles.value.map(p => (
		<Card key={p.id}>
			<CardHeader title={p.name} subheader={p.id} />
			<CardActions>
				<ButtonGroup fullWidth={true}>
					<Button
						color={"error"}
						onClick={() => {
							dialogService.boolDialog({
								title: _t('ConfirmProfileDeletion')
							})
								.then(r => {
									if (r) {
										configService.removeProfile(p.id);
										profiles.value = loadProfiles();
									}
								});
						}}
					>{_t('Delete')}</Button>
					<Button
						onClick={() => {
							fileExportService.exportJson(p, `${p.name}.profile.json`);
						}}
					>{_t('Export')}</Button>
					<Button
						onClick={() => {
							popupService.show({
								content: (close) => (
									<ProfileEditor
										id={p.id}
										onCancel={close}
										onSave={() => {
											close();
											profiles.value = loadProfiles();
										}}
									/>
								)
							});
						}}
					>{_t('Edit')}</Button>
					<Button
						variant={'contained'}
						onClick={() => props.switchProfile(p.id)}
					>{_t('Start')}</Button>
				</ButtonGroup>
			</CardActions>
		</Card>
	)));

	return (
		<Container>
			<Stack spacing={1}>
				{content}
				<Box>
					<Button onClick={() => {
						popupService.show({
							content: (close) => (
								<ProfileEditor
									id={uuid()}
									onCancel={close}
									onSave={() => {
										close();
										profiles.value = loadProfiles();
									}}
								/>
							)
						});
					}}>{_t('AddProfile')}</Button>
					<Button onClick={() => {
						dialogService.fileDialog({
							title: _t('ChooseImportFile'),
							accept: 'application/json',
						})
							.then(r => {
								const id = uuid();
								const file = r[0];
								const fileReader = new FileReader();
								fileReader.onloadend = () => {
									configService.setProfile(id, { ...JSON.parse(fileReader.result as string), id: id });
									profiles.value = loadProfiles();
								};
								fileReader.readAsText(file);
							});
					}}>{_t('ImportProfile')}</Button>
				</Box>
			</Stack>
		</Container>
	);
}
