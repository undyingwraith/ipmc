import { Home, Settings } from '@mui/icons-material';
import { Box, Button, ButtonGroup, IconButton } from '@mui/material';
import { batch, useComputed, useSignal } from '@preact/signals-react';
import { createRemoteIpfs, ProfileModule } from 'ipmc-core';
import { IConfigurationService, IIpfsService, IIpfsServiceSymbol, ILogService, ILogServiceSymbol, INodeService, IProfile, IProfileSymbol, isInternalProfile, isRemoteProfile } from 'ipmc-interfaces';
import React, { PropsWithChildren } from 'react';
import { Redirect, Route, Switch, useLocation } from 'wouter';
import { ErrorDisplay, Spacer } from './components/atoms';
import { LanguageSelector, LoadScreen, ProfileSelector } from './components/molecules';
import { AppBar } from './components/organisms';
import { LibraryManager } from './components/pages';
import { SettingsPage } from './components/pages/SettingsPage/SettingsPage';
import { AppContextProvider, useService } from './context';
import { useTranslation } from './hooks';
import { UiModule } from './services/UiModule';

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

export const StopFunctionSymbol = Symbol.for('StopFunction');
export type TStopFunction = (restart?: boolean) => Promise<void>;

export function IpmcLauncher(props: PropsWithChildren<IIpmcLauncherProps>) {
	const _t = useTranslation();
	const [_, setLocation] = useLocation();
	const log = useService<ILogService>(ILogServiceSymbol);

	const state = useSignal<LoadState>(LoadState.Idle);
	const node = useSignal<IIpfsService | undefined>(undefined);
	const profile = useSignal<IProfile | undefined>(undefined);
	const error = useSignal<Error | undefined>(undefined);

	async function start(name: string) {
		if (name == undefined) return;

		const currentProfile = await props.configService.getProfile(name);
		if (currentProfile != undefined) {
			profile.value = currentProfile;
			try {
				state.value = LoadState.Starting;

				let ipfs: IIpfsService;
				if (isRemoteProfile(currentProfile)) {
					ipfs = await createRemoteIpfs(currentProfile.url);
				} else if (isInternalProfile(currentProfile)) {
					ipfs = await props.nodeService.create(currentProfile);
				} else {
					throw new Error('Unknown profile type');
				}

				batch(() => {
					node.value = ipfs;
					state.value = LoadState.Ready;
				});
			} catch (ex) {
				log.error(ex);
				batch(() => {
					error.value = ex;
					state.value = LoadState.Error;
				});
			}
		}
	}

	async function stop(restart = false) {
		if (node.value != undefined) {
			state.value = LoadState.Stopping;
			try {
				await node.value!.stop();
				const profileId = profile.value?.id;
				batch(() => {
					node.value = undefined;
					profile.value = undefined;
				});
				if (restart && profileId) {
					start(profileId);
				}
			} catch (ex) {
				log.error(ex);
				state.value = LoadState.Error;
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
						<ErrorDisplay error={error.value!} />
						<ButtonGroup>
							<Button onClick={() => state.value = LoadState.Idle}>Home</Button>
						</ButtonGroup>
					</Box>
				);
			case LoadState.Idle:
				return (<>
					<AppBar>
						<Route path={'/settings'}>
							<IconButton
								onClick={() => setLocation('~/')}
								title={_t('Home').value}
							>
								<Home />
							</IconButton>
						</Route>
						<Spacer />
						<LanguageSelector />
						<IconButton
							onClick={() => {
								setLocation('~/settings');
							}}
							title={_t('Settings').value}
						>
							<Settings />
						</IconButton>
					</AppBar>
					<Switch>
						<Route path={'/settings'} component={SettingsPage} />
						<Route path={'/'}>
							<ProfileSelector switchProfile={start} />
						</Route>
						<Redirect to={'/'} />
					</Switch>
				</>);
			case LoadState.Starting:
			case LoadState.Stopping:
				return (
					<LoadScreen text={_t(currentState == LoadState.Starting ? 'Starting' : 'Stopping')} />
				);
			case LoadState.Ready:
				return (
					<AppContextProvider setup={(app) => {
						app.registerConstant<TStopFunction>(stop, StopFunctionSymbol);
						app.registerConstant<IIpfsService>(ipfs!, IIpfsServiceSymbol);
						app.registerConstant<IProfile>(currentProfile!, IProfileSymbol);
						app.use(ProfileModule);
						app.use(UiModule);
					}} >
						<LibraryManager />
					</AppContextProvider>
				);
			default:
				return (<></>);
		}
	});
}
