import { IFileInfo } from 'ipmc-interfaces';

export const IGlobalSearchServiceSymbol = Symbol.for('IGlobalSearchService');

/**
 * Service that queries all avaiable libraries.
 */
export interface IGlobalSearchService {
	/**
	 * Searches for items that match the specified query.
	 * @param query The text to search for.
	 */
	search(query: string): IFileInfo[];
}
