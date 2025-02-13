export interface HasPinAbility {
	pinId: string;
	cid: string;
}

export function isPinFeature(item: any): item is HasPinAbility {
	return item !== undefined && typeof item.pinId === 'string' && typeof item.cid === 'string';
}
