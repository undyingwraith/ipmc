import { HasPinAbility, HasPoster, HasTitle, HasYear } from '../Features';
import { IVideoFile } from '../IVideoFile';


export type IMovieMetaData = IVideoFile & HasPoster & HasPinAbility & HasYear & HasTitle;
