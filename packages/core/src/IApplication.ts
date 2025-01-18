export const IApplicationSymbol = Symbol.for('IApplication');

/**
 * The main application holding everything together.
 */
export interface IApplication {
	/**
	 * Gets a service identified by its symbol.
	 * @param identifier symbol for the service.
	 * @returns The requested service.
	 */
	getService<T>(identifier: symbol): T | undefined;
}
