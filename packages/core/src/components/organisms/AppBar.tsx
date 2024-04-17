import { Box, Button, Toolbar } from "@mui/material";
import React from "react";
import { ConnectionStatus } from "../molecules/ConnectionStatus";
import { LanguageSelector } from "../molecules/LanguageSelector";
import { IIpfsService } from "../../service";
import { Signal, useComputed } from '@preact/signals-react';
import { useTranslation } from "react-i18next";

export function AppBar(props: { shutdownProfile: () => void, ipfs: Signal<IIpfsService | undefined> }) {
	const [_t] = useTranslation();

	return useComputed(() => {
		const ipfs = props.ipfs.value;

		return (
			<Box sx={{ backgroundColor: 'primary' }}>
				<Toolbar>
					{ipfs != undefined && <Button onClick={props.shutdownProfile}>{_t('Logout')}</Button>}
					<Box sx={{ flexGrow: 1 }} />
					{ipfs != undefined && <ConnectionStatus ipfs={ipfs} />}
					<LanguageSelector />
				</Toolbar>
			</Box>
		);
	});
}
