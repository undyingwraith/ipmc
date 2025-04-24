/**
 * An item that has a year.
 */
export interface HasYear {
	/**
	 * The year of the item.
	 */
	year: number;
}

/**
 * Checks whether the specified item is a {@link HasYear} item.
 * @param item item to check.
 * @returns whether the specified item is a {@link HasYear} item.
 */
export function isYearFeature(item: any): item is HasYear {
	return item !== undefined && typeof item.year === 'number';
}
