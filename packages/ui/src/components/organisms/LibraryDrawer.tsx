import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useComputed, useSignal } from "@preact/signals-react";
import { IProfile, IProfileSymbol } from "ipmc-interfaces";
import React from "react";
import { LibraryTypeDictionary } from 'src/dictionaries';
import { useLocation } from 'wouter';
import { useService } from '../../context';
import { useHotkey, useLinkedSignal, useTranslation } from '../../hooks';

export function LibraryDrawer() {
	const profile = useService<IProfile>(IProfileSymbol);
	const _t = useTranslation();
	const [loc, setLocation] = useLocation();
	const location = useLinkedSignal(loc);

	const drawerOpen = useSignal(false);
	const libraries = profile.libraries;

	function toggle() {
		drawerOpen.value = !drawerOpen.peek();
	}

	useHotkey({
		key: 'm',
		ctrl: true,
	}, toggle);

	return (<>
		<IconButton onClick={toggle}>
			<MenuIcon />
		</IconButton>
		{useComputed(() => (
			<Drawer open={drawerOpen.value} onClose={toggle}>
				<List sx={{ minWidth: '25vw' }}>
					<ListItem disablePadding>
						<ListItemButton
							selected={location.value === '/'}
							onClick={() => {
								setLocation('/');
								drawerOpen.value = false;
							}}>
							<ListItemIcon>
								<HomeIcon />
							</ListItemIcon>
							<ListItemText primary={_t('Home')} />
						</ListItemButton>
					</ListItem>
					<Divider />
					{libraries.map((lib) => (
						<ListItem key={lib.id} disablePadding>
							<ListItemButton
								selected={location.value.startsWith('/' + lib.id)}
								onClick={() => {
									setLocation('/' + lib.id);
									drawerOpen.value = false;
								}}>
								<ListItemIcon>
									{LibraryTypeDictionary[lib.type] ?? LibraryTypeDictionary.unknown}
								</ListItemIcon>
								<ListItemText primary={lib.name} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
		))}
	</>);
}
