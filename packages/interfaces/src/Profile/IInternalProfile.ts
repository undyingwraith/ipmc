import { IBaseProfile } from "./IBaseProfile";

export interface IInternalProfile extends IBaseProfile {
	type: 'internal';

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

export function isInternalProfile(profile: any): profile is IInternalProfile {
	return profile.type == 'internal';
} 
