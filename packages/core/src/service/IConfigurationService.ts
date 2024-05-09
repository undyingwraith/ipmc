import { IProfile } from './Profile';

/**
 * Service to manage app configuration.
 */
export interface IConfigurationService {
	/**
	 * Gets a list of all profile names.
	 */
	getProfiles(): string[];

	/**
	 * Returns the specified Profile.
	 * @param name name of the profile
	 */
	getProfile(name: string): IProfile;

	/**
	 * Updates the specified Profile.
	 * @param name name of the profile
	 * @param profile updated profile
	 */
	setProfile(name: string, profile: IProfile): void;

	/**
	 * Deletes the specified Profile.
	 * @param name name of the profile
	 */
	removeProfile(name: string): void;
}
