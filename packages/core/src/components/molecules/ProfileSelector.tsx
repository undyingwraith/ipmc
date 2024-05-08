import React from "react";
import { IConfigurationService, IProfile } from "../../service";
import { CardActions, Button, ButtonGroup, Card, CardContent, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useComputed, useSignal } from "@preact/signals-react";

export function ProfileSelector(props: { profile?: IProfile, profiles: string[], switchProfile: (name: string) => void, configService: IConfigurationService }) {
	const { configService } = props;

	const [_t] = useTranslation();
	const editing = useSignal<string | undefined>(undefined);

	const dialog = useComputed(() => {
		if (editing.value !== undefined) {
			return <></>;
		}
		return (
			<Dialog
				open={true}
				onClose={() => editing.value = undefined}
			>
				<DialogTitle>{_t('EditProfile')}</DialogTitle>
				<DialogContent>
					TODO
				</DialogContent>
				<DialogActions>
					<Button onClick={() => editing.value = undefined}>{_t('Cancel')}</Button>
					<Button>{_t('Save')}</Button>
				</DialogActions>
			</Dialog>
		);
	});

	return (<>
		<Stack spacing={1}>
			{props.profiles.map(p => <Card key={p}>
				<CardContent>{p}</CardContent>
				<CardActions>
					<ButtonGroup>
						<Button onClick={() => editing.value = p}>{_t('Edit')}</Button>
						<Button onClick={() => props.switchProfile(p)}>{_t('Start')}</Button>
					</ButtonGroup>
				</CardActions>
			</Card>)}
			<div>
				<Button onClick={() => editing.value = ''}>{_t('AddProfile')}</Button>
			</div>
		</Stack>
		{dialog}
	</>);
}