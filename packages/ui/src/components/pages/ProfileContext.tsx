import { Alert, Box, Button, ButtonGroup, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { useComputed, useSignal } from "@preact/signals-react";
import {
	IIpfsService,
	isInternalProfile,
	isRemoteProfile,
	IProfileManager,
	IConfigurationService,
	INodeService,
} from 'ipmc-interfaces';
import React, { createContext, PropsWithChildren, useContext } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { SimpleProfileManager, RemoteProfileManager } from 'ipmc-core';
import { createDarkTheme, createLightTheme } from '../../Theme';
import { LoadScreen } from "../molecules/LoadScreen";
import { ProfileSelector } from "../molecules/ProfileSelector";
import { AppBar } from "../organisms/AppBar";

export interface IProfileContext {
	config: IConfigurationService;
	ipfs: IIpfsService;
	profile: IProfileManager;
}

export interface IProfileInit {
	configService: IConfigurationService;
	nodeService: INodeService;
}

const ProfileContext = createContext<IProfileContext>({} as IProfileContext);

enum LoadState {
	Idle,
	Ready,
	Starting,
	Stopping,
	Error,
}

export function ProfileContextProvider(props: PropsWithChildren<IProfileInit>) {
	const _t = useTranslation();

	const profileManager = useSignal<IProfileManager | undefined>(undefined);
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

				let manager: IProfileManager | undefined;
				if (isRemoteProfile(currentProfile)) {
					manager = new RemoteProfileManager(currentProfile);
				}
				if (isInternalProfile(currentProfile)) {
					manager = new SimpleProfileManager(await props.nodeService.create(currentProfile), currentProfile);
				}

				if (manager) {
					await manager.start();
					profileManager.value = manager;
					state.value = LoadState.Ready;
				} else {
					state.value = LoadState.Error;
				}
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
				profileManager.value = undefined;
			} catch (ex) {
				console.error(ex);
				state.value = LoadState.Error;
			}
		}
		state.value = LoadState.Idle;
	}

	const content = useComputed(() => {
		const manager = profileManager.value;
		const currentState = state.value;

		switch (currentState) {
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
						<ProfileSelector switchProfile={start} profiles={props.configService.getProfiles()} />
					</Box>
				);
			case LoadState.Starting:
			case LoadState.Stopping:
				return (
					<LoadScreen text={_t(currentState == LoadState.Starting ? 'Starting' : 'Stopping')} />
				);
			case LoadState.Ready:
				return (
					<ProfileContext.Provider value={{
						config: props.configService,
						ipfs: manager!.ipfs!,
						profile: manager!,
					}}>
						{props.children}
					</ProfileContext.Provider>
				);
			default:
				return (<></>);
		}
	});

	const profile = useComputed(() => profileManager.value?.profile);
	const node = useComputed(() => profileManager.value?.ipfs);

	return useComputed(() => (
		<ThemeProvider theme={theme.value}>
			<CssBaseline />
			<Stack sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
				<AppBar shutdownProfile={stop} ipfs={node} profile={profile} darkMode={darkMode} />
				{content}
			</Stack>
		</ThemeProvider>
	));
}

export function useProfile() {
	return useContext(ProfileContext);
}