import { HasPinAbility, HasPoster, HasTitle } from '../Features';
import { IFolderFile } from '../IFolderFile';
import { IVideoFile } from '../IVideoFile';

/**
 * The metadata of a series.
 */
export type ISeriesMetaData = IFolderFile & HasPinAbility & HasTitle & HasPoster & {
	yearStart?: number;
	yearEnd?: number;
};

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
