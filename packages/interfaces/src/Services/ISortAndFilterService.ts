import { IFileInfo } from '../MetaData';

export const ISortAndFilterServiceSymbol = Symbol.for('ISortAndFilterService');

export interface ISortAndFilterService {
	/**
	 * Sorts and filters a list.
	 * @param list The list to sort and filter.
	 * @param query The text to filter by.
	 */
	createFilteredList<T extends IFileInfo>(list: T[], query?: string): T[];
}
