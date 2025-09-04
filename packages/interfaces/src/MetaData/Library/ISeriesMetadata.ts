import { HasBackdrop, HasPinAbility, HasPoster, HasTitle, isBackdropFeature, isPinFeature, isPosterFeature, isTitleFeature } from '../Features';
import { IFolderFile, isIFolderFile } from '../IFolderFile';
import { isIVideoFile, IVideoFile } from '../IVideoFile';

/**
 * The metadata of a series.
 */
export type ISeriesMetadata = IFolderFile & HasPinAbility & HasTitle & HasPoster & HasBackdrop & {
	yearStart?: number;
	yearEnd?: number;
};

/**
 * Checks whether an item is an {@link ISeriesMetadata}.
 * @param item the item to check.
 * @returns true if the item is a {@link ISeriesMetadata}.
 */
export function isISeriesMetadata(item: any): item is ISeriesMetadata {
	return isIFolderFile(item) && isPinFeature(item) && isTitleFeature(item) && isPosterFeature(item) && isBackdropFeature(item);
}


/**
 * The metadata of a season.
 */
export type ISeasonMetadata = IFolderFile & HasPoster & HasPinAbility & HasBackdrop;


/**
 * The metadata of an episode.
 */
export type IEpisodeMetadata = IVideoFile & HasPinAbility & HasTitle & HasPoster & HasBackdrop & {
	date?: string;
	series: string;
	episode: string;
	season: string;
};

/**
 * Checks whether an item is an {@link IEpisodeMetadata}.
 * @param item the item to check.
 * @returns true if the item is a {@link IEpisodeMetadata}.
 */
export function isIEpisodeMetadata(item: any): item is IEpisodeMetadata {
	return isIVideoFile(item) && isPinFeature(item) && isTitleFeature(item) && isPosterFeature(item) && isBackdropFeature(item)
		&& item.hasOwnProperty('series')
		&& item.hasOwnProperty('episode')
		&& item.hasOwnProperty('season');
}
