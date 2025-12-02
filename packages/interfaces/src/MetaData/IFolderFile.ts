import { IFileInfo, isIFileInfo } from './IFileInfo';

/**
 * Info about a folder.
 */
export interface IFolderFile<T extends IFileInfo = IFileInfo> extends IFileInfo {
	/**
	 * The items in the folder.
	 */
	items: T[];
}

/**
 * Checks whether the specified item is a {@link IFolderFile}.
 * @param item item to check.
 * @returns whether the specified item is a {@link IFolderFile}.
 */
export function isIFolderFile(item: any): item is IFolderFile {
	return Object.hasOwn(item, 'items') && typeof item.items === 'object' && isIFileInfo(item);
}
