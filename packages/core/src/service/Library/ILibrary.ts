import { IMovieMetaData } from './IMovieMetaData';
import { IGenericLibrary } from './IGenericLibrary';

export type IMovieLibrary = IGenericLibrary<IMovieMetaData, 'movie'>;

export type ISeriesLibrary = IGenericLibrary<any, 'series'>;

export type IMusicLibrary = IGenericLibrary<any, 'music'>;

export type ILibrary = IMovieLibrary | ISeriesLibrary;
