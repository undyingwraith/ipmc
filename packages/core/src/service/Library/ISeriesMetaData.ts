import { IFileInfo, IFolderFile, IVideoFile } from './Files';

export interface ISeriesMetaData extends IFolderFile {
	title: string;
	posters: IFileInfo[];
	yearStart?: number;
	yearEnd?: number;
}

export interface ISeasonMetaData extends IFolderFile {
	posters: IFileInfo[];
}

export interface IEpisodeMetaData extends IVideoFile {
	title: string;
	thumbnails: IFileInfo[];
	date?: string;
}
