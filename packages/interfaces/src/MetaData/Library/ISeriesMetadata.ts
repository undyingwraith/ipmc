import { HasBackdrop, HasPinAbility, HasPoster, HasTitle, isBackdropFeature, isPinFeature, isPosterFeature, isTitleFeature } from '../Features';
import { IFolderFile, isIFolderFile } from '../IFolderFile';
import { isIVideoFile, IVideoFile } from '../IVideoFile';

/**
 * The metadata of a series.
 */
export type ISeriesMetadata = IFolderFile & HasPinAbility & HasTitle & HasPoster & HasBackdrop & {
	/**
	 * Seasons
	 */
	items: ISeasonMetadata[];

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
export type ISeasonMetadata = IFolderFile & HasPoster & HasPinAbility & HasBackdrop & {
	/**
	 * Episodes.
	 */
	items: IEpisodeMetadata[];

	/**
	 * Name of the series.
	 */
	series: string;

	/**
	 * Season number.
	 */
	season: string;
};


/**
 * Checks whether an item is an {@link ISeasonMetadata}.
 * @param item the item to check.
 * @returns true if the item is a {@link ISeasonMetadata}.
 */
export function isISeasonMetadata(item: any): item is ISeasonMetadata {
	return isIFolderFile(item) && isPinFeature(item) && isPosterFeature(item) && isBackdropFeature(item)
		&& item.hasOwnProperty('series')
		&& item.hasOwnProperty('season');
}

/**
 * The metadata of an episode.
 */
export type IEpisodeMetadata = IVideoFile & HasPinAbility & HasTitle & HasPoster & HasBackdrop & {
	date?: string;

	/**
	 * Name of the series.
	 */
	series: string;

	/**
	 * Season number.
	 */
	season: string;

	/**
	 * Episode number.
	 */
	episode: string;
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
