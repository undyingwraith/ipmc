import { ILibrary } from '../MetaData';

/**
 * The base properties of a {@link IProfile}.
 */
export interface IBaseProfile<TType extends string> {
	/**
	 * The type of profile.
	 */
	type: TType;

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

/**
 * Checks whether the specified item is a {@link IBaseProfile}.
 * @param item item to check.
 * @returns whether the specified item is a {@link IBaseProfile}.
 */
export function isIBaseProfile(item: any): item is IBaseProfile<string> {
	return typeof item.name === 'string' && typeof item.type === 'string' && typeof item.id === 'string' && typeof item.libraries.length !== 'undefined';
}
