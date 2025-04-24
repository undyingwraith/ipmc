import { IBaseProfile, isIBaseProfile } from "./IBaseProfile";

/**
 * A {@link IProfile} for a internal ipfs node.
 */
export interface IInternalProfile extends IBaseProfile<'internal'> {
	/**
	 * Optional port number for the node to use (default: any available port).
	 */
	port?: number;

	/**
	 * Swarm key if it is a private network.
	 */
	swarmKey?: string;

	/**
	 * List of bootstrap adresses.
	 */
	bootstrap?: string[];
}

/**
 * Checks whether the specified item is a {@link IInternalProfile}.
 * @param profile item to check.
 * @returns whether the specified item is a {@link IInternalProfile}.
 */
export function isInternalProfile(profile: any): profile is IInternalProfile {
	return isIBaseProfile(profile) && profile.type == 'internal';
} 
