import { IFileInfo, isIFileInfo } from './IFileInfo';

export interface IVideoFile extends IFileInfo {
	video: IFileInfo;
	thumbnails: IFileInfo[];
}

export function isIVideoFile(item: any): item is IVideoFile {
	return isIFileInfo(item);
}
