import { IFileInfo } from '../IFileInfo';

export interface IGenericLibrary<TData extends IFileInfo, TType extends string> {
	/**
	 * Name of the library. Must be unique.
	 */
	name: string;

	/**
	 * IPNS path to update from.
	 */
	upstream?: string;

	/**
	 * Last resolved root.
	 */
	root: string;

	/**
	 * Cached index.
	 */
	index?: {
		cid: string,
		values: TData[];
	};

	/**
	 * Type of the library.
	 */
	type: TType;
}

export function isGenericLibrary<TData extends IFileInfo, TType extends string>(item: any): item is IGenericLibrary<TData, TType> {
	return item?.name !== undefined && typeof item?.type === 'string';
}
