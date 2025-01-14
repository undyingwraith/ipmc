import { IMovieMetaData } from './IMovieMetaData';
import { IGenericLibrary, isGenericLibrary } from './IGenericLibrary';
import { ISeriesMetaData } from './ISeriesMetaData';

export type IMovieLibrary = IGenericLibrary<IMovieMetaData, 'movie'>;

export type ISeriesLibrary = IGenericLibrary<ISeriesMetaData, 'series'>;

export type IMusicLibrary = IGenericLibrary<any, 'music'>;

export type ILibrary = IMovieLibrary | ISeriesLibrary | IMusicLibrary;
