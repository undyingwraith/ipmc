import React, { createContext, PropsWithChildren, useContext } from 'react';
import {
	IConfigurationService,
	INodeService,
	IIpfsService
} from '../../service';
import {
	isInternalProfile,
	isRemoteProfile,
} from '../../service/Profile';
import { Box, CssBaseline, ThemeProvider, Stack, Alert, Button, ButtonGroup } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useComputed, useSignal } from "@preact/signals-react";
import { createDarkTheme, createLightTheme } from '../../Theme';
import { ProfileSelector } from "../molecules/ProfileSelector";
import { AppBar } from "../organisms/AppBar";
import { LoadScreen } from "../molecules/LoadScreen";
import { SimpleProfileManager } from '../../service/ProfileManager/SimpleProfileManager';
import { IProfileManager } from '../../service/ProfileManager';

export interface IAppContext {
	config: IConfigurationService;
	ipfs: IIpfsService;
	profile: IProfileManager;
}

export interface IAppInit {
	configService: IConfigurationService;
	nodeService: INodeService;
}

const AppContext = createContext<IAppContext>({} as IAppContext);

enum LoadState {
	Idle,
	Ready,
	Starting,
	Stopping,
	Error,
}

export function AppContextProvider(props: PropsWithChildren<IAppInit>) {
	const [_t] = useTranslation();

	const profileManager = useSignal<IProfileManager | undefined>(undefined);
	const node = useSignal<IIpfsService | undefined>(undefined);
	const state = useSignal<LoadState>(LoadState.Idle);
	const darkMode = useSignal<boolean>(true);

	const accentColor = useComputed(() => '#6200EE');
	const theme = useComputed(() => darkMode.value ? createDarkTheme(accentColor.value) : createLightTheme(accentColor.value));

	async function start(name: string) {
		if (name == undefined) return;

		const currentProfile = props.configService.getProfile(name);
		if (currentProfile != undefined) {
			try {
				state.value = LoadState.Starting;

				if (isRemoteProfile(currentProfile)) {
					node.value = await props.nodeService.createRemote(currentProfile.url);
				}
				if (isInternalProfile(currentProfile)) {
					node.value = await props.nodeService.create(currentProfile);
				}
				const manager = new SimpleProfileManager(node.value!, currentProfile);
				profileManager.value = manager;
				await manager.start();

				state.value = LoadState.Ready;
			} catch (ex) {
				console.error(ex);
				state.value = LoadState.Error;
			}
		}
	}

	async function stop() {
		if (node.value != undefined) {
			state.value = LoadState.Stopping;
			try {
				await profileManager.value!.stop();
				node.value = undefined;
				profileManager.value = undefined;
			} catch (ex) {
				console.error(ex);
				state.value = LoadState.Error;
			}
		}
		state.value = LoadState.Idle;
	}


	const content = useComputed(() => {
		switch (state.value) {
			case LoadState.Error:
				return (
					<Box>
						<Alert severity="error">An error occured.</Alert>
						<ButtonGroup>
							<Button onClick={() => state.value = LoadState.Idle}>Home</Button>
						</ButtonGroup>
					</Box>
				);
			case LoadState.Idle:
				return (
					<Box>
						<ProfileSelector switchProfile={start} configService={props.configService} />
					</Box>
				);
			case LoadState.Starting:
			case LoadState.Stopping:
				return (
					<LoadScreen text={_t(state.value == LoadState.Starting ? 'Starting' : 'Stopping')} />
				);
			case LoadState.Ready:
				return (
					<AppContext.Provider value={{
						config: props.configService,
						ipfs: node.value!,
						profile: profileManager.value!,
					}}>
						{props.children}
					</AppContext.Provider>
				);
			default:
				return (<></>);
		}
	});

	const profile = useComputed(() => profileManager.value?.profile);

	return useComputed(() => (
		<ThemeProvider theme={theme.value}>
			<CssBaseline />
			<Stack sx={{ height: '100vh', overflow: 'hidden' }}>
				<AppBar shutdownProfile={stop} ipfs={node} profile={profile} darkMode={darkMode} />
				{content}
			</Stack>
		</ThemeProvider>
	));
}

export function useApp() {
	return useContext(AppContext);
}
