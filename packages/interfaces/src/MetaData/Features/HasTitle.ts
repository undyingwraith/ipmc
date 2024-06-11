export interface HasTitle {
	title: string;
}

export function isTitleFeature(item: any): item is HasTitle {
	return item !== undefined && typeof item.title === 'string';
}
