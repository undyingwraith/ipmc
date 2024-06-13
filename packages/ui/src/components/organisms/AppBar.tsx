import { Box, Button, Toolbar } from "@mui/material";
import React from "react";
import { ConnectionStatus } from "../molecules/ConnectionStatus";
import { LanguageSelector } from "../molecules/LanguageSelector";
import { Signal, useComputed } from '@preact/signals-react';
import { ThemeToggle } from '../atoms/ThemeToggle';
import { useTranslation } from '../../hooks/useTranslation';
import { IIpfsService, IProfile } from 'ipmc-interfaces';
import { useTheme } from '../../context/ThemeContext';

export function AppBar(props: {
	shutdownProfile: () => void;
	ipfs: Signal<IIpfsService | undefined>;
	profile: Signal<IProfile | undefined>;
}) {
	const { shutdownProfile, ipfs, profile } = props;
	const _t = useTranslation();
	const { darkMode } = useTheme();

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
