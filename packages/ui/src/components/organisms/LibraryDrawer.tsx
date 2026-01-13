import { Logout, Settings } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useComputed, useSignal } from "@preact/signals-react";
import { IProfile, IProfileSymbol } from "ipmc-interfaces";
import React from "react";
import { useLocation } from 'wouter';
import { useService } from '../../context';
import { useHotkey, useLinkedSignal, useTranslation } from '../../hooks';
import { StopFunctionSymbol, TStopFunction } from '../../IpmcLauncher';
import { LibraryTypeDictionary } from '../../utils';

export function LibraryDrawer() {
	const profile = useService<IProfile>(IProfileSymbol);
	const stop = useService<TStopFunction>(StopFunctionSymbol);
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
				<List sx={{ minWidth: '25vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
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
					<div style={{ flexGrow: 1 }} />
					<Divider />
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => {
								setLocation('~/settings');
								drawerOpen.value = false;
							}}
						>
							<ListItemIcon>
								<Settings />
							</ListItemIcon>
							<ListItemText>
								{_t('Settings')}
							</ListItemText>
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => stop()}>
							<ListItemIcon>
								<Logout />
							</ListItemIcon>
							<ListItemText primary={_t('Logout')} />
						</ListItemButton>
					</ListItem>
				</List>
			</Drawer>
		))}
	</>);
}
