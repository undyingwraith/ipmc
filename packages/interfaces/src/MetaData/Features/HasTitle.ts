/**
 * An item that has a title.
 */
export interface HasTitle {
	/**
	 * Title of the item.
	 */
	title: string;
}

/**
 * Checks whether the specified item is a {@link HasTitle} item.
 * @param item item to check.
 * @returns whether the specified item is a {@link HasTitle} item.
 */
export function isTitleFeature(item: any): item is HasTitle {
	return item !== undefined && typeof item.title === 'string';
}
