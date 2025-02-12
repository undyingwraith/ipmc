import { HasPinAbility, IFileInfo } from '../../MetaData';
import { IPinItem } from './IPinItem';
import { Signal } from '@preact/signals-core';

export const IPinManagerServiceSymbol = Symbol.for('IPinManagerService');

export enum PinStatus {
	UnPinned,
	Pinned,
	Working,
}

/**
 * Manages pinned items.
 */
export interface IPinManagerService {
	/**
	 * Checks whether an item is pinned or not.
	 * @param item The item to check.
	 */
	isPinned(item: HasPinAbility): PinStatus;

	/**
	 * Adds a pin to an item.
	 * @param item the item to pin.
	 */
	addPin(item: HasPinAbility): Promise<void>;

	/**
	 * Removes a pin from an item.
	 * @param item the item to remove the pin from.
	 */
	removePin(item: HasPinAbility): Promise<void>;

	/**
	 * List all currently pinned items.
	 */
	listPins(): IPinItem[];

	/**
	 * Resolves a {@link IPinItem} to its original {@link IFileInfo}.
	 * @param item The item to resolve.
	 * @returns The resolved {@link IFileInfo} or undefined.
	 */
	resolvePin(item: IPinItem): IFileInfo | undefined;

	/**
	 * A list of all currently pinned items.
	 */
	pins: Signal<IPinItem[]>;
}
