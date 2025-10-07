import { IFileInfo } from '../IFileInfo';

/**
 * An item that has an Artist.
 */
export interface HasGenre {
	/**
	 * Genre as a String.
	 */
	genre: String;

}

/**
 * Checks whether the specified item is a {@link HasGenre} item.
 * @param item item to check.
 * @returns whether the specified item is a {@link HasGenre} item.
 */
export function isGenreFeature(item: any): item is HasGenre {
	return item !== undefined && typeof item.genre == 'string';
}
