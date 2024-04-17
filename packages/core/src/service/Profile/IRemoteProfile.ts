import { IBaseProfile } from "./IBaseProfile";

export interface IRemoteProfile extends IBaseProfile {
	type: 'remote';
	url?: string;
}

export function isRemoteProfile(profile: any): profile is IRemoteProfile {
	return profile.type == 'remote'
}
