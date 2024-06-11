import { IFileInfo, isIFileInfo } from './IFileInfo';

export interface IImageFile extends IFileInfo {

}

export function isIImageFile(item: any): item is IImageFile {
	return isIFileInfo(item);
}
