import React, { createContext, PropsWithChildren, useContext } from 'react';
import {
	IConfigurationService,
	IProfile,
	INodeService,
	IIpfsService
} from '../../service';
import {
	isInternalProfile,
	isRemoteProfile,
} from '../../service/Profile';
import { Box, CssBaseline, ThemeProvider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useComputed, useSignal } from "@preact/signals-react";
import { createDarkTheme, createLightTheme } from "../../Theme";
import { ProfileSelector } from "../molecules/ProfileSelector";
import { AppBar } from "../organisms/AppBar";
import { LoadScreen } from "../molecules/LoadScreen";

export interface IAppContext {
	config: IConfigurationService
	ipfs: IIpfsService
	profile: IProfile
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
};

export function AppContextProvider(props: PropsWithChildren<IAppInit>) {
	const [_t] = useTranslation();

	const profile = useSignal<IProfile | undefined>(undefined);
	const node = useSignal<IIpfsService | undefined>(undefined);
	const state = useSignal<LoadState>(LoadState.Idle);

	const accentColor = useComputed(() => '#6200EE');
	const darkMode = useComputed(() => true);
	const theme = useComputed(() => darkMode.value ? createDarkTheme(accentColor.value) : createLightTheme(accentColor.value));

	async function start(name: string) {
		if (name == undefined) return;

		const currentProfile = props.configService.getProfile(name);
		if (currentProfile != undefined) {
			profile.value = currentProfile;
			state.value = LoadState.Starting;

			if (isRemoteProfile(currentProfile)) {
				node.value = await props.nodeService.createRemote(currentProfile.url);
			}
			if (isInternalProfile(currentProfile)) {
				node.value = await props.nodeService.create(currentProfile);
			}

			state.value = LoadState.Ready;
		}
	}

	async function stop() {
		if (node.value != undefined) {
			state.value = LoadState.Stopping;
			await node.value.stop();
			node.value = undefined;
		}
		state.value = LoadState.Idle;
	}


	const content = useComputed(() => {
		switch (state.value) {
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
						profile: profile.value!,
					}}>
						{props.children}
					</AppContext.Provider>
				);
			default:
				return (<></>);
		}
	});

	return (
		<ThemeProvider theme={theme.value}>
			<CssBaseline />
			<Stack sx={{ height: '100vh', overflow: 'hidden' }}>
				<AppBar shutdownProfile={stop} ipfs={node} />
				{content}
			</Stack>
		</ThemeProvider>
	);
}

export function useApp() {
	return useContext(AppContext)
}
