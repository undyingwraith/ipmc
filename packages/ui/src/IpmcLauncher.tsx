import React, { PropsWithChildren } from 'react';
import { useComputed, useSignal } from '@preact/signals-react';
import { useTranslation } from './hooks';
import { IConfigurationService, IIpfsService, IIpfsServiceSymbol, INodeService, IProfileManager, IProfileManagerSymbol, isInternalProfile, isRemoteProfile } from 'ipmc-interfaces';
import { RemoteProfileManager, SimpleProfileManager } from 'ipmc-core';
import { IpmcApp } from './IpmcApp';
import { Alert, Box, Button, ButtonGroup, Stack } from '@mui/material';
import { ProfileSelector } from './components/molecules/ProfileSelector';
import { LoadScreen } from './components/molecules/LoadScreen';

enum LoadState {
	Idle,
	Ready,
	Starting,
	Stopping,
	Error,
}

export interface IIpmcLauncherProps {
	configService: IConfigurationService;
	nodeService: INodeService;
}

export const IReturnToLauncherActionSymbol = Symbol.for('IReturnToLauncherAction');

export type IReturnToLauncherAction = () => void;

export function IpmcLauncher(props: PropsWithChildren<IIpmcLauncherProps>) {
	const _t = useTranslation();

	const profileManager = useSignal<IProfileManager | undefined>(undefined);
	const state = useSignal<LoadState>(LoadState.Idle);

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

	const node = useComputed(() => profileManager.value?.ipfs);

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
					<IpmcApp setup={(app) => {
						app.registerConstant<IIpfsService>(manager!.ipfs!, IIpfsServiceSymbol);
						app.registerConstant<IProfileManager>(manager!, IProfileManagerSymbol);
						app.registerConstant<IReturnToLauncherAction>(stop, IReturnToLauncherActionSymbol);
					}} />
				);
			default:
				return (<></>);
		}
	});

	return useComputed(() => (
		<Stack sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
			{content}
		</Stack>
	));
}
