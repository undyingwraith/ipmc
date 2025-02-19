import { Alert, Box, Button, ButtonGroup /*, colors*/ } from '@mui/material';
import { useComputed, useSignal } from '@preact/signals-react';
import { createRemoteIpfs, IndexManager } from 'ipmc-core';
import { IConfigurationService, IIndexManagerSymbol, IIpfsService, IIpfsServiceSymbol, ILogService, ILogServiceSymbol, INodeService, IProfile, IProfileSymbol, isInternalProfile, isRemoteProfile } from 'ipmc-interfaces';
import React, { PropsWithChildren } from 'react';
import { ThemeToggle } from './components/atoms';
import { ConnectionStatus, LanguageSelector, LoadScreen, ProfileSelector } from './components/molecules';
import { LibraryManager } from './components/pages';
import { AppContextProvider, useService } from './context';
import { useAppbarButtons, useTranslation } from './hooks';
import { AppbarButtonService, AppbarButtonServiceSymbol } from './services';

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

export function IpmcLauncher(props: PropsWithChildren<IIpmcLauncherProps>) {
	const _t = useTranslation();
	const appbarService = useService<AppbarButtonService>(AppbarButtonServiceSymbol);
	const log = useService<ILogService>(ILogServiceSymbol);

	const state = useSignal<LoadState>(LoadState.Idle);
	const node = useSignal<IIpfsService | undefined>(undefined);
	const profile = useSignal<IProfile | undefined>(undefined);
	const nodeButton = useSignal<Symbol | undefined>(undefined);
	const profileButton = useSignal<Symbol | undefined>(undefined);

	useAppbarButtons([{
		component: (<ThemeToggle />),
		position: 'end',
		sortIndex: 9,
	}, {
		component: (<LanguageSelector />),
		position: 'end',
		sortIndex: 10,
	}]);

	async function start(name: string) {
		if (name == undefined) return;

		const currentProfile = await props.configService.getProfile(name);
		if (currentProfile != undefined) {
			profile.value = currentProfile;
			try {
				state.value = LoadState.Starting;

				if (isRemoteProfile(currentProfile)) {
					node.value = await createRemoteIpfs(currentProfile.url);
				} else if (isInternalProfile(currentProfile)) {
					node.value = await props.nodeService.create(currentProfile);
				} else {
					throw new Error('Unknown profile type');
				}

				nodeButton.value = appbarService.registerAppbarButton({
					position: 'end',
					component: (<ConnectionStatus ipfs={node.value} />)
				});
				profileButton.value = appbarService.registerAppbarButton({
					position: 'start',
					component: (<>
						<Button onClick={stop} color={'info'}>{_t('Logout')}</Button>
						{currentProfile.name}
					</>)
				});

				state.value = LoadState.Ready;
			} catch (ex) {
				log.error(ex);
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
				log.error(ex);
				state.value = LoadState.Error;
			} finally {
				nodeButton.value && appbarService.unRegisterAppbarButton(nodeButton.value);
				profileButton.value && appbarService.unRegisterAppbarButton(profileButton.value);
			}
		}
		state.value = LoadState.Idle;
	}

	return useComputed(() => {
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
						<ProfileSelector switchProfile={start} />
					</Box>
				);
			case LoadState.Starting:
			case LoadState.Stopping:
				return (
					<LoadScreen text={_t(currentState == LoadState.Starting ? 'Starting' : 'Stopping')} />
				);
			case LoadState.Ready:
				return (
					<AppContextProvider setup={(app) => {
						app.registerConstant<IIpfsService>(ipfs!, IIpfsServiceSymbol);
						app.registerConstant<IProfile>(currentProfile!, IProfileSymbol);
						app.register(IndexManager, IIndexManagerSymbol);
					}} >
						<LibraryManager />
					</AppContextProvider>
				);
			default:
				return (<></>);
		}
	});
}
