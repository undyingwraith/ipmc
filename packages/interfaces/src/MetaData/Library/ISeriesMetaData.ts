import { HasPinAbility, HasPoster } from '../Features';
import { IFileInfo } from '../IFileInfo';
import { IFolderFile } from '../IFolderFile';
import { IVideoFile } from '../IVideoFile';

export type ISeriesMetaData = IFolderFile & HasPinAbility & {
	title: string;
	posters: IFileInfo[];
	yearStart?: number;
	yearEnd?: number;
};

export type ISeasonMetaData = IFolderFile & HasPoster & HasPinAbility;

export type IEpisodeMetaData = IVideoFile & HasPinAbility & {
	title: string;
	date?: string;
};
