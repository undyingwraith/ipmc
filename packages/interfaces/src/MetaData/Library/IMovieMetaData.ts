import { HasBackdrop, HasPinAbility, HasPoster, HasTitle, HasYear, isBackdropFeature, isPinFeature, isPosterFeature, isTitleFeature, isYearFeature } from '../Features';
import { isIVideoFile, IVideoFile } from '../IVideoFile';

/**
 * The metadata of a movie.
 */
export type IMovieMetaData = IVideoFile & HasPoster & HasBackdrop & HasPinAbility & HasYear & HasTitle;

export function isIMovieMetadata(item: any): item is IMovieMetaData {
	return isIVideoFile(item) && isPosterFeature(item) && isBackdropFeature(item) && isPinFeature(item) && isYearFeature(item) && isTitleFeature(item);
}
