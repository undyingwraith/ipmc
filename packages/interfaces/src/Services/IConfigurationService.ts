import { IProfile } from '../Profile';

export const IConfigurationServiceSymbol = Symbol.for('IConfigurationService');

/**
 * Service to manage app configuration.
 */
export interface IConfigurationService {
	/**
	 * Gets a list of all {@link IProfile} names.
	 */
	getProfiles(): string[];

	/**
	 * Returns the specified {@link IProfile}.
	 * @param id id of the {@link IProfile}.
	 */
	getProfile(id: string): IProfile;

	/**
	 * Updates the specified {@link IProfile}.
	 * @param id id of the {@link IProfile}.
	 * @param profile updated {@link IProfile}.
	 */
	setProfile(id: string, profile: IProfile): void;

	/**
	 * Deletes the specified {@link IProfile}.
	 * @param id id of the {@link IProfile}.
	 */
	removeProfile(id: string): void;
}
