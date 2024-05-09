import { IMovieMetaData } from './IMovieMetaData';
import { IGenericLibrary, isGenericLibrary } from './IGenericLibrary';

export type IMovieLibrary = IGenericLibrary<IMovieMetaData, 'movie'>;

export function isMovieLibrary(item: any): item is IMovieLibrary {
	return isGenericLibrary<IMovieMetaData, 'movie'>(item) && item.type === 'movie';
}

export type ISeriesLibrary = IGenericLibrary<any, 'series'>;

export function isSeriesLibrary(item: any): item is IMovieLibrary {
	return isGenericLibrary<any, 'series'>(item) && item.type === 'series';
}

export type IMusicLibrary = IGenericLibrary<any, 'music'>;

export function isMusicLibrary(item: any): item is IMovieLibrary {
	return isGenericLibrary<any, 'music'>(item) && item.type === 'music';
}

export type ILibrary = IMovieLibrary | ISeriesLibrary | IMusicLibrary;
