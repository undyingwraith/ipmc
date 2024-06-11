import { IFileInfo, isTitleFeature } from 'ipmc-interfaces';

export function useTitle(file: IFileInfo): string {
	return isTitleFeature(file) ? file.title : file.name;
}
