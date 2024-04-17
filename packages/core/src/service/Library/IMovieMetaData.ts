import { IFileInfo } from '../indexer';
import { IGenericMetaData } from './IGenericMetaData';

export interface IMovieMetaData extends IGenericMetaData<'movie'> {
	title: string;
	file: IFileInfo;
	thumbnails: IFileInfo[];
	posters: IFileInfo[];
	year?: number;
}
