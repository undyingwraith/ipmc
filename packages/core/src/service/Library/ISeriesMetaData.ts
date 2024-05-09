import { IFileInfo } from '../indexer';
import { IGenericMetaData } from './IGenericMetaData';

export interface ISeriesMetaData extends IGenericMetaData<'series'> {
	title: string;
	posters: IFileInfo[];
	yearStart?: number;
	yearEnd?: number;
	seasons: ISeasonMetaData[];
}

export interface ISeasonMetaData {
	posters: IFileInfo[];
	episodes: IEpisodeMetaData[];
}

export interface IEpisodeMetaData {
	title: string;
	file: IFileInfo;
	thumbnails: IFileInfo[];
	date?: string;
}
