import { IFileInfo, isIFileInfo } from './IFileInfo';

export interface IFolderFile extends IFileInfo {
	items: IFileInfo[];
}

export function isIFolderFile(item: any): item is IFolderFile {
	return typeof item.items === 'object' && isIFileInfo(item);
}
