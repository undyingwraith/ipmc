import { IBaseProfile, isIBaseProfile } from "./IBaseProfile";

/**
 * A {@link IProfile} for a remote ipfs node.
 */
export interface IRemoteProfile extends IBaseProfile<'remote'> {
	/**
	 * The api url to connect to.
	 */
	url?: string;
}

/**
 * Checks whether the specified profile is a {@link IRemoteProfile}.
 * @param profile profile to check.
 * @returns whether the specified profile is a {@link IRemoteProfile}.
 */
export function isRemoteProfile(profile: any): profile is IRemoteProfile {
	return isIBaseProfile(profile) && profile.type == 'remote';
}
