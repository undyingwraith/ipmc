import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton } from '@mui/material';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import React from 'react';

export function ThemeToggle(props: { toggle: () => void; isDark: ReadonlySignal<boolean>; }) {
	const icon = useComputed(() => props.isDark.value ? <LightModeIcon /> : <DarkModeIcon />);

	return <IconButton onClick={props.toggle}>
		{icon}
	</IconButton>;
}
