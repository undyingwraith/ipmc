import { IFileInfo } from '../IFileInfo';

/**
 * An item that has an Artist.
 */
export interface HasArtist {
	/**
	 * Artist as a String.
	 */
	artist: String;

}

/**
 * Checks whether the specified item is a {@link HasArtist} item.
 * @param item item to check.
 * @returns whether the specified item is a {@link HasArtist} item.
 */
export function isArtistFeature(item: any): item is HasArtist {
	return item !== undefined && typeof item.artist == 'string';
}
