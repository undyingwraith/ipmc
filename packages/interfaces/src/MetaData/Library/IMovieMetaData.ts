import { HasPoster } from '../Features';
import { IVideoFile } from '../IVideoFile';


export type IMovieMetaData = IVideoFile & HasPoster & {
	title: string;
	year?: number;
};
