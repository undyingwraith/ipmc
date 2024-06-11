import { ReadonlySignal } from '@preact/signals-react';
import { ILibrary } from '../MetaData';
import { ITask } from '../ITask';
import { IProfile } from '../Profile';
import { IIpfsService } from './IIpfsService';

/**
 * Manages a profile.
 */
export interface IProfileManager {
	/**
	 * Starts the service.
	 */
	start(): Promise<void>;

	/**
	 * Stops the service.
	 */
	stop(): Promise<void>;

	/**
	 * Currently available libraries.
	 */
	libraries: Map<string, ReadonlySignal<ILibrary>>;

	/**
	 * Current status of the service.
	 */
	state: ReadonlySignal<ProfileManagerState>;

	/**
	 * Current tasks of the service.
	 */
	tasks: ReadonlySignal<ITask[]>;

	/**
	 * The profile of the service.
	 */
	profile: IProfile;

	/**
	 * Ipfs service of the profile if started.
	 */
	ipfs: undefined | IIpfsService;
}

export enum ProfileManagerState {
	Running,
	Stopped,
	Error,
}
