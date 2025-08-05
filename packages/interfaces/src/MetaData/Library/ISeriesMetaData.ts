import { HasPinAbility, HasPoster, HasTitle, isPinFeature, isPosterFeature, isTitleFeature } from '../Features';
import { IFolderFile, isIFolderFile } from '../IFolderFile';
import { IVideoFile } from '../IVideoFile';

/**
 * The metadata of a series.
 */
export type ISeriesMetaData = IFolderFile & HasPinAbility & HasTitle & HasPoster & {
	yearStart?: number;
	yearEnd?: number;
};

/**
 * Checks whether an item is an {@link ISeriesMetaData}.
 * @param item the item to check.
 * @returns true if the item is a {@link ISeriesMetaData}.
 */
export function isISeriesMetadata(item: any): item is ISeriesMetaData {
	return isIFolderFile(item) && isPinFeature(item) && isTitleFeature(item) && isPosterFeature(item);
}

/**
 * The metadata of a season.
 */
export type ISeasonMetaData = IFolderFile & HasPoster & HasPinAbility;

/**
 * The metadata of an episode.
 */
export type IEpisodeMetaData = IVideoFile & HasPinAbility & HasTitle & {
	date?: string;
};
