/**
 * An item that can be pinned/favorited.
 */
export interface HasPinAbility {
	/**
	 * The id of the item.
	 */
	pinId: string;

	/**
	 * The CID to be pinned.
	 */
	cid: string;
}

/**
 * Checks whether the specified item is a {@link HasPinAbility} item.
 * @param item item to check.
 * @returns whether the specified item is a {@link HasPinAbility} item.
 */
export function isPinFeature(item: any): item is HasPinAbility {
	return item !== undefined && typeof item.pinId === 'string' && typeof item.cid === 'string';
}
