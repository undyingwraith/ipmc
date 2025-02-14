import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton } from '@mui/material';
import { useComputed } from '@preact/signals';
import { useService } from '../../context';
import { ThemeService, ThemeServiceSymbol } from '../../services';

export function ThemeToggle() {
	const themeService = useService<ThemeService>(ThemeServiceSymbol);
	const icon = useComputed(() => themeService.darkMode.value ? <LightModeIcon /> : <DarkModeIcon />);

	return <IconButton onClick={() => {
		themeService.darkMode.value = !themeService.darkMode.value;
	}}>
		{icon}
	</IconButton>;
}
