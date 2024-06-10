import { HasPoster } from './Features';
import { IFileInfo, IFolderFile, IVideoFile } from './Files';

export type ISeriesMetaData = IFolderFile & {
	title: string;
	posters: IFileInfo[];
	yearStart?: number;
	yearEnd?: number;
};

export type ISeasonMetaData = IFolderFile & HasPoster;

export interface IEpisodeMetaData extends IVideoFile {
	title: string;
	date?: string;
}
