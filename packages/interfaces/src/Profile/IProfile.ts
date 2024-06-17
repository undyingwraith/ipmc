import { IInternalProfile, isInternalProfile } from "./IInternalProfile";
import { IRemoteProfile, isRemoteProfile } from "./IRemoteProfile";

export type IProfile = IInternalProfile | IRemoteProfile;

export function isIProfile(item: any): item is IProfile {
	return isInternalProfile(item) || isRemoteProfile(item);
}
