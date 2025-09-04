import { IFileInfo } from '../IFileInfo';

/**
 * An item that has a backdrop.
 */
export interface HasBackdrop {
	/**
	 * List of backdrops.
	 */
	backdrops: IFileInfo[];

}

/**
 * Checks whether the specified item is a {@link HasBackdrop} item.
 * @param item item to check.
 * @returns whether the specified item is a {@link HasBackdrop} item.
 */
export function isBackdropFeature(item: any): item is HasBackdrop {
	return item !== undefined && typeof item.backdrops?.length === 'number';
}
