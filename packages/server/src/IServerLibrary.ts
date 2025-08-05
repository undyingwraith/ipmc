import type { ILibrary } from 'ipmc-interfaces';

export interface IServerLibrary extends ILibrary {
	/**
	 * Whether or not the server should keep the {@link ILibrary} pinned.
	 */
	keepPinned?: boolean;

	/**
	 * Libraries that should be merged into this one, will only import new items.
	 */
	updateFrom?: ILibrary[];
}
