import { IFileInfo, isIFileInfo } from './IFileInfo';
import { ISubtitleMetadata } from './ISubtitleMetadata';

export interface IMusicFile extends IFileInfo {
	music: IFileInfo;
	thumbnails: IFileInfo[];
	lyrics?: string;
}

export function isIMusicFile(item: any): item is IMusicFile {
	return typeof item.music !== 'undefined' && typeof item.thumbnails?.length === 'number' && isIFileInfo(item);
}
