import { HasPinAbility, HasPoster, HasTitle, HasYear, isPinFeature, isPosterFeature, isTitleFeature, isYearFeature } from '../Features';
import { HasAlbum, isAlbumFeature } from '../Features/HasAlbum';
import { HasArtist, isArtistFeature } from '../Features/HasArtist';
import { HasGenre, isGenreFeature } from '../Features/HasGenre';
import { IAudioFile, isIAudioFile } from '../IAudioFile';
import { IFolderFile, isIFolderFile } from '../IFolderFile';

/**
 * The metadata of a piece of Audio.
 */
export type IAudioMetadata = IAudioFile & HasPinAbility & HasYear & HasTitle & HasArtist & HasAlbum & HasGenre;

/**
 * Checks whether an item is an {@link IAudioMetadata}.
 * @param item the item to check.
 * @returns true if the item is a {@link ISeasonMetadata}.
 */
export function isIAudioMetadata(item: unknown): item is IAudioMetadata {
	return isIAudioFile(item) && isPinFeature(item) && isYearFeature(item) && isTitleFeature(item) && isArtistFeature(item) && isAlbumFeature(item) && isGenreFeature(item);
}

/**
 * The metadata of an Album.
 */
export type IAlbumMetadata = IFolderFile<IAudioMetadata> & HasPoster & HasPinAbility & HasArtist;

export function isIAlbumMetadata(item: unknown): item is IAlbumMetadata {
	return isIFolderFile(item) && isPosterFeature(item) && isPinFeature(item) && isArtistFeature(item);
}

/**
 * The metadata of an Artist.
 */
export type IArtistMetadata = IFolderFile & HasPoster & HasPinAbility;

export function isIArtistMetadata(item: unknown): item is IAlbumMetadata {
	return isIFolderFile(item) && isPosterFeature(item) && isPinFeature(item);
}

