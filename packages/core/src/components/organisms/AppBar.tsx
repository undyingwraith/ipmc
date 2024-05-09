import { Box, Button, Toolbar } from "@mui/material";
import React from "react";
import { ConnectionStatus } from "../molecules/ConnectionStatus";
import { LanguageSelector } from "../molecules/LanguageSelector";
import { IIpfsService, IProfile } from "../../service";
import { Signal, useComputed } from '@preact/signals-react';
import { useTranslation } from "react-i18next";
import { ThemeToggle } from '../atoms/ThemeToggle';

export function AppBar(props: {
	shutdownProfile: () => void;
	ipfs: Signal<IIpfsService | undefined>;
	profile: Signal<IProfile | undefined>;
	darkMode: Signal<boolean>;
}) {
	const { shutdownProfile, ipfs, profile, darkMode } = props;
	const [_t] = useTranslation();

	const status = useComputed(() => ipfs.value != undefined && (<ConnectionStatus ipfs={ipfs.value} />));
	const logout = useComputed(() => ipfs.value != undefined && (<>
		<Button onClick={shutdownProfile}>{_t('Logout')}</Button>
		{profile.value?.name}
	</>));

	return (
		<Box sx={{ backgroundColor: 'primary' }}>
			<Toolbar>
				{logout}
				<Box sx={{ flexGrow: 1 }} />
				{status}
				<ThemeToggle isDark={darkMode} toggle={() => {
					darkMode.value = !darkMode.value;
				}} />
				<LanguageSelector />
			</Toolbar>
		</Box>
	);
}
