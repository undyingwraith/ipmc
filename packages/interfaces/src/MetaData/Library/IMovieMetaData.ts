import { HasBackdrop, HasPinAbility, HasPoster, HasTitle, HasYear } from '../Features';
import { IVideoFile } from '../IVideoFile';

/**
 * The metadata of a movie.
 */
export type IMovieMetaData = IVideoFile & HasPoster & HasBackdrop & HasPinAbility & HasYear & HasTitle;
