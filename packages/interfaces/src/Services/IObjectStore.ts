/**
 * A service to store an retrieve objects.
 */
export interface IObjectStore {
	/**
	 * Saves a value with specified key to the store.
	 * @param key key of the value to set.
	 * @param value value to set.
	 */
	set<T extends object>(key: string, value: T): void;

	/**
	 * Retrieves a value by the specified key from the store.
	 * @param key key of the value to retrieve.
	 */
	get<T extends object>(key: string): T | undefined;
}
