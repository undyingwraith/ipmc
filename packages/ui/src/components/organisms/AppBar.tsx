import { Box, Toolbar } from "@mui/material";
import React from "react";
import { useService } from '../../context';
import { AppbarButtonService, AppbarButtonServiceSymbol } from '../../services';
import { ThemeToggle } from '../atoms/ThemeToggle';
import { LanguageSelector } from "../molecules/LanguageSelector";

export function AppBar() {
	const appbarService = useService<AppbarButtonService>(AppbarButtonServiceSymbol);

	return (
		<Box sx={{ backgroundColor: 'primary' }}>
			<Toolbar>
				{appbarService.appbarButtons}
				<ThemeToggle />
				<LanguageSelector />
			</Toolbar>
		</Box>
	);
}
