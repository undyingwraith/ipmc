import { IFileInfo } from '../Files/IFileInfo';

export interface HasPoster {
	posters: IFileInfo[];
}

export function isPosterFeature(item: any): item is HasPoster {
	return item !== undefined && typeof item.posters?.length === 'number';
}
