/**
 * Info about a file.
 */
export interface IFileInfo {
	/**
	 * CID of the file.
	 */
	cid: string;

	/**
	 * Name of the file.
	 */
	name: string;

	path?: string;

	/**
	 * Type of the file.
	 */
	type: 'dir' | 'file';
}
