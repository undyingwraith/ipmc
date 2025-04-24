import { IFileInfo } from '../IFileInfo';

/**
 * An item that has a Poster.
 */
export interface HasPoster {
	/**
	 * List of posters.
	 */
	posters: IFileInfo[];
}

/**
 * Checks whether the specified item is a {@link HasPoster} item.
 * @param item item to check.
 * @returns whether the specified item is a {@link HasPoster} item.
 */
export function isPosterFeature(item: any): item is HasPoster {
	return item !== undefined && typeof item.posters?.length === 'number';
}
