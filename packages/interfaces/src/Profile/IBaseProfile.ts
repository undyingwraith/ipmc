import { ILibrary } from '../MetaData';

export interface IBaseProfile {
	/**
	 * Id of the profile.
	 */
	id: string;

	/**
	 * Name of the profile.
	 */
	name: string;

	/**
	 * Libraries of the profile.
	 */
	libraries: ILibrary[];
}
