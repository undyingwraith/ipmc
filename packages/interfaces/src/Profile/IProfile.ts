import { IInternalProfile, isInternalProfile } from "./IInternalProfile";
import { IRemoteProfile, isRemoteProfile } from "./IRemoteProfile";

export const IProfileSymbol = Symbol.for('IProfile');

/**
 * A profile.
 */
export type IProfile = IInternalProfile | IRemoteProfile;

/**
 * Checks whether the specified item is a {@link IProfile}.
 * @param item item to check.
 * @returns whether the specified item is a {@link IProfile}.
 */
export function isIProfile(item: any): item is IProfile {
	return isInternalProfile(item) || isRemoteProfile(item);
}
