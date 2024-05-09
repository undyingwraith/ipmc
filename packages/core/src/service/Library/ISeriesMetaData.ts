import { IFileInfo } from '../indexer';

export interface ISeriesMetaData {
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
