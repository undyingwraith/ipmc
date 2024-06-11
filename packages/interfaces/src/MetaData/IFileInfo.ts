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

	/**
	 * Absolute path in library.
	 */
	path?: string;

	/**
	 * Type of the file.
	 */
	type: 'dir' | 'file';
}

export function isIFileInfo(item: any): item is IFileInfo {
	return (
		typeof item === 'object' &&
		typeof item.cid == 'string' &&
		typeof item.name == 'string'
	);
}
