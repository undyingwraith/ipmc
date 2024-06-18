import { Box, Button, Toolbar } from "@mui/material";
import React from "react";
import { ConnectionStatus } from "../molecules/ConnectionStatus";
import { LanguageSelector } from "../molecules/LanguageSelector";
import { ThemeToggle } from '../atoms/ThemeToggle';
import { useTranslation } from '../../hooks/useTranslation';
import { IIpfsService, IIpfsServiceSymbol, IProfile, IProfileSymbol } from 'ipmc-interfaces';
import { useTheme } from '../../context/ThemeContext';
import { useOptionalService, useService } from '../../context';
import { IReturnToLauncherAction, IReturnToLauncherActionSymbol } from '../../IpmcLauncher';

export function AppBar() {
	const shutdownProfile = useOptionalService<IReturnToLauncherAction>(IReturnToLauncherActionSymbol);
	const ipfs = useService<IIpfsService>(IIpfsServiceSymbol);
	const profile = useService<IProfile>(IProfileSymbol);
	const _t = useTranslation();
	const { darkMode } = useTheme();

	return (
		<Box sx={{ backgroundColor: 'primary' }}>
			<Toolbar>
				{shutdownProfile && <Button onClick={shutdownProfile}>{_t('Logout')}</Button>}
				{profile.name}
				<Box sx={{ flexGrow: 1 }} />
				<ConnectionStatus ipfs={ipfs} />
				<ThemeToggle isDark={darkMode} toggle={() => {
					darkMode.value = !darkMode.value;
				}} />
				<LanguageSelector />
			</Toolbar>
		</Box>
	);
}
