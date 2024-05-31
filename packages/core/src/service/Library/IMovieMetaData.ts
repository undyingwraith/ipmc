import { IFileInfo, IVideoFile } from './Files';

export interface IMovieMetaData extends IVideoFile {
	title: string;
	posters: IFileInfo[];
	year?: number;
}
