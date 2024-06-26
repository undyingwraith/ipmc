import React, { PropsWithChildren } from 'react';
import { useComputed, useSignal } from '@preact/signals-react';
import { useTranslation } from './hooks';
import { IConfigurationService, IIpfsService, IIpfsServiceSymbol, INodeService, IProfile, IProfileSymbol, isInternalProfile, isRemoteProfile } from 'ipmc-interfaces';
import { createRemoteIpfs } from 'ipmc-core';
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

	const state = useSignal<LoadState>(LoadState.Idle);
	const node = useSignal<IIpfsService | undefined>(undefined);
	const profile = useSignal<IProfile | undefined>(undefined);

	async function start(name: string) {
		if (name == undefined) return;

		const currentProfile = props.configService.getProfile(name);
		if (currentProfile != undefined) {
			profile.value = currentProfile;
			try {
				state.value = LoadState.Starting;

				if (isRemoteProfile(currentProfile)) {
					node.value = await createRemoteIpfs(currentProfile.url);
				}
				if (isInternalProfile(currentProfile)) {
					node.value = await props.nodeService.create(currentProfile);
				}

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
				await node.value!.stop();
				node.value = undefined;
				profile.value = undefined;
			} catch (ex) {
				console.error(ex);
				state.value = LoadState.Error;
			}
		}
		state.value = LoadState.Idle;
	}

	const content = useComputed(() => {
		const ipfs = node.value;
		const currentState = state.value;
		const currentProfile = profile.value;

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
						<ProfileSelector switchProfile={start} configService={props.configService} />
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
						app.registerConstant<IIpfsService>(ipfs!, IIpfsServiceSymbol);
						app.registerConstant<IProfile>(currentProfile!, IProfileSymbol);
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
