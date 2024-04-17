import React from "react";
import { IProfile } from "../../service";
import { CardActions, Button, ButtonGroup, Card, CardContent, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

export function ProfileSelector(props: { profile?: IProfile, profiles: string[], switchProfile: (name: string) => void }) {
	const [_t] = useTranslation();

	return <Stack>
		{props.profiles.map(p => <Card key={p}>
			<CardContent>{p}</CardContent>
			<CardActions>
				<ButtonGroup>
					<Button>{_t('Edit')}</Button>
					<Button onClick={() => props.switchProfile(p)}>{_t('Start')}</Button>
				</ButtonGroup>
			</CardActions>
		</Card>)}
	</Stack>
}