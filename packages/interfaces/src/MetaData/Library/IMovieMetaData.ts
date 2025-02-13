import { HasPinAbility, HasPoster } from '../Features';
import { IVideoFile } from '../IVideoFile';


export type IMovieMetaData = IVideoFile & HasPoster & HasPinAbility & {
	title: string;
	year?: number;
};
