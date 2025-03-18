import { IFileInfo, isIFileInfo } from './IFileInfo';
import { ISubtitleMetadata } from './ISubtitleMetadata';

export interface IVideoFile extends IFileInfo {
	video: IFileInfo;
	thumbnails: IFileInfo[];
	languages: string[];
	subtitles: ISubtitleMetadata[];
}

export function isIVideoFile(item: any): item is IVideoFile {
	return typeof item.video !== 'undefined' && typeof item.thumbnails?.length === 'number' && isIFileInfo(item);
}
