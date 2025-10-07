import { IFileInfo } from '../IFileInfo';

/**
 * An item that has an Artist.
 */
export interface HasAlbum {
	/**
	 * Album as a String.
	 */
	album: String;

}

/**
 * Checks whether the specified item is a {@link HasAlbum} item.
 * @param item item to check.
 * @returns whether the specified item is a {@link HasAlbum} item.
 */
export function isAlbumFeature(item: any): item is HasAlbum {
	return item !== undefined && typeof item.album == 'string';
}
