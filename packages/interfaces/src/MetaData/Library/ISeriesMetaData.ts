import { HasPoster } from '../Features';
import { IFileInfo } from '../IFileInfo';
import { IFolderFile } from '../IFolderFile';
import { IVideoFile } from '../IVideoFile';

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
