export interface IGenericLibrary<TType extends string> {
	/**
	 * Id of the library. Must be unique.
	 */
	id: string;

	/**
	 * Name of the library. Must be unique.
	 */
	name: string;

	/**
	 * IPNS path to update from.
	 */
	upstream: string;

	/**
	 * Type of the library.
	 */
	type: TType;
}
