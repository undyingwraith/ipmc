import { Button, ButtonGroup, Card, CardActions, CardHeader, Dialog, Stack } from "@mui/material";
import { useComputed, useSignal } from "@preact/signals-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { IConfigurationService, IProfile } from "../../service";
import { uuid } from '../../util';
import { ProfileEditor } from "./ProfileEditor";

export function ProfileSelector(props: { profile?: IProfile, switchProfile: (name: string) => void, configService: IConfigurationService; }) {
	const { configService } = props;

	const [_t] = useTranslation();
	const editing = useSignal<string | undefined>(undefined);
	const profiles = useSignal<(IProfile & { id: string; })[]>(loadProfiles());

	function loadProfiles() {
		return configService.getProfiles().map(p => ({
			...configService.getProfile(p),
			id: p,
		}));
	}

	const dialog = useComputed(() => {
		if (editing.value == undefined) {
			return <></>;
		}
		return (
			<Dialog
				open={true}
				onClose={() => editing.value = undefined}
			>
				<ProfileEditor
					id={editing.value}
					configService={configService}
					onCancel={() => editing.value = undefined}
					onSave={() => {
						editing.value = undefined;
						profiles.value = loadProfiles();
					}}
				/>
			</Dialog>
		);
	});

	const content = useComputed(() => profiles.value.map(p => (
		<Card key={p.id}>
			<CardHeader title={p.name} subheader={p.id} />
			<CardActions>
				<ButtonGroup>
					<Button
						color={"error"}
						onClick={() => {
							configService.removeProfile(p.id);
							profiles.value = loadProfiles();
						}}
					>{_t('Delete')}</Button>
					<Button
						onClick={() => editing.value = p.id}
					>{_t('Edit')}</Button>
					<Button
						variant={'contained'}
						onClick={() => props.switchProfile(p.id)}
					>{_t('Start')}</Button>
				</ButtonGroup>
			</CardActions>
		</Card>
	)));

	return (<>
		<Stack spacing={1}>
			{content}
			<div>
				<Button onClick={() => editing.value = uuid()}>{_t('AddProfile')}</Button>
			</div>
		</Stack>
		{dialog}
	</>);
}
