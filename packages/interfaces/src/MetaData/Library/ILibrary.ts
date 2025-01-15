import { IGenericLibrary } from './IGenericLibrary';

export type IMovieLibrary = IGenericLibrary<'movie'>;

export type ISeriesLibrary = IGenericLibrary<'series'>;

export type IMusicLibrary = IGenericLibrary<'music'>;

export type ILibrary = IMovieLibrary | ISeriesLibrary | IMusicLibrary;
