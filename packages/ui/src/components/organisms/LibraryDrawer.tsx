import { ExpandLess, ExpandMore, Logout } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import { Collapse, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Signal, useComputed, useSignal } from "@preact/signals-react";
import { ILibrary, IProfile, IProfileSymbol } from "ipmc-interfaces";
import React from "react";
import { useService } from '../../context';
import { useHotkey, useTranslation } from '../../hooks';
import { StopFunctionSymbol } from '../../IpmcLauncher';
import { ILibraryNavigationService, ILibraryNavigationServiceSymbol, INavigationService, INavigationServiceSymbol } from '../../services';
import { LibraryTypeDictionary } from '../../utils';

export function LibraryDrawer() {
	const profile = useService<IProfile>(IProfileSymbol);
	const stop = useService<() => void>(StopFunctionSymbol);
	const navService = useService<INavigationService>(INavigationServiceSymbol);
	const _t = useTranslation();

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
							selected={navService.path.value === '/'}
							onClick={() => {
								navService.navigate('/');
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
						<DrawerItem
							drawerOpen={drawerOpen}
							library={lib}
							key={lib.id}
						/>
					))}
					<div style={{ flexGrow: 1 }} />
					<Divider />
					<ListItem disablePadding>
						<ListItemButton
							onClick={stop}>
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


function DrawerItem(props: { library: ILibrary; drawerOpen: Signal<boolean>; }) {
	const { library, drawerOpen } = props;

	const _t = useTranslation();
	const libraryNavigation = useService<ILibraryNavigationService>(ILibraryNavigationServiceSymbol);
	const open = useSignal<boolean>(false);

	const hasSubTypes = libraryNavigation.hasSubNavigation(library);

	return (<>
		<ListItem disablePadding>
			{useComputed(() => (
				<ListItemButton
					selected={libraryNavigation.isActive(library).value}
					onClick={() => {
						libraryNavigation.navigateTo(library);
						drawerOpen.value = false;
					}}
				>
					<ListItemIcon>
						{LibraryTypeDictionary[library.type] ?? LibraryTypeDictionary.unknown}
					</ListItemIcon>
					<ListItemText primary={library.name} />
				</ListItemButton>
			))}
			{hasSubTypes && (
				<ListItemButton
					onClick={() => {
						open.value = !open.value;
					}}
					sx={{ flexGrow: 0 }}
				>
					{useComputed(() => open.value ? <ExpandLess /> : <ExpandMore />)}
				</ListItemButton>
			)}
		</ListItem>
		{useComputed(() => hasSubTypes && (
			<Collapse in={open.value} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{libraryNavigation.getViews(library)?.map((v) => (
						<ListItemButton
							sx={{ pl: 4 }}
							key={v}
							selected={libraryNavigation.isActive(library, v).value}
							onClick={() => libraryNavigation.navigateTo(library, v)}
						>
							<ListItemIcon>
								{/*TODO*/}
							</ListItemIcon>
							<ListItemText primary={_t(v)} />
						</ListItemButton>
					))}
				</List>
			</Collapse>
		))}
	</>);
}
