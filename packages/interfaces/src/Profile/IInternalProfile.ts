import { IBaseProfile } from "./IBaseProfile";

export interface IInternalProfile extends IBaseProfile {
	type: 'internal';
	port?: number;
	swarmKey?: string;
	bootstrap?: string[];
}

export function isInternalProfile(profile: any): profile is IInternalProfile {
	return profile.type == 'internal';
} 
