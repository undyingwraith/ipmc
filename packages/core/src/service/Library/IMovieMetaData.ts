import { HasPoster } from './Features';
import { IVideoFile } from './Files';

export type IMovieMetaData = IVideoFile & HasPoster & {
	title: string;
	year?: number;
};
