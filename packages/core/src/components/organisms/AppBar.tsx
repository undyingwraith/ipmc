import { Box, Button, Toolbar } from "@mui/material";
import React from "react";
import { ConnectionStatus } from "../molecules/ConnectionStatus";
import { LanguageSelector } from "../molecules/LanguageSelector";
import { IIpfsService, IProfile } from "../../service";
import { Signal, useComputed } from '@preact/signals-react';
import { useTranslation } from "react-i18next";

export function AppBar(props: {
	shutdownProfile: () => void;
	ipfs: Signal<IIpfsService | undefined>;
	profile: Signal<IProfile | undefined>;
}) {
	const { shutdownProfile } = props;
	const [_t] = useTranslation();

	return useComputed(() => {
		const ipfs = props.ipfs.value;
		const profile = props.profile.value;

		return (
			<Box sx={{ backgroundColor: 'primary' }}>
				<Toolbar>
					{ipfs != undefined && (<>
						<Button onClick={shutdownProfile}>{_t('Logout')}</Button>
						{profile?.name}
					</>)}
					<Box sx={{ flexGrow: 1 }} />
					{ipfs != undefined && <ConnectionStatus ipfs={ipfs} />}
					<LanguageSelector />
				</Toolbar>
			</Box>
		);
	});
}
