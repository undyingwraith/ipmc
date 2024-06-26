import { ReadonlySignal } from '@preact/signals-react';
import { ILibrary } from '../Library';
import { IProfile } from '../Profile';
import { ITask } from '../ITask';

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
}

export enum ProfileManagerState {
	Running,
	Stopped,
	Error,
}
