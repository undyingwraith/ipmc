import { IFileInfo } from '../IFileInfo';

export interface IGenericLibrary<TType extends string> {
	/**
	 * Name of the library. Must be unique.
	 */
	name: string;

	/**
	 * IPNS path to update from.
	 */
	upstream?: string;

	/**
	 * Type of the library.
	 */
	type: TType;
}
