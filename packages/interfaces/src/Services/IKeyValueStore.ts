export const IKeyValueStoreSymbol = Symbol.for('IKeyValueStore');

/**
 * A service to store an retrieve simple string values.
 */
export interface IKeyValueStore {
	/**
	 * Saves a value with specified key to the store.
	 * @param key key of the value to set.
	 * @param value value to set.
	 */
	set(key: string, value: string): void;

	/**
	 * Retrieves a value by the specified key from the store.
	 * @param key key of the value to retrieve.
	 */
	get(key: string): string | undefined;
}
