export interface HasYear {
	year: number;
}

export function isYearFeature(item: any): item is HasYear {
	return item !== undefined && typeof item.year === 'number';
}
