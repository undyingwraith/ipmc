import { Signal } from '@preact/signals-core';

export const IPersistentSignalServiceSymbol = Symbol.for('IPersistentSignalService');

/**
 * Service that gives {@link Signal}'s which are persisted in the {@link IKeyValueStore}.
 */
export interface IPersistentSignalService {
	/**
	 * Retrieves a {@link Signal} which will be persisted.
	 * @param storageKey the key under which to store and retrieve this value.
	 * @param defaultValue The default value to use if it has never been used.
	 */
	get<T>(storageKey: string, defaultValue: T): Signal<T>;
}
