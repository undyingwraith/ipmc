import { ReadonlySignal, Signal } from '@preact/signals-react';
import { IFileInfo } from 'ipmc-interfaces';
import { IFilter } from './IFilter';

export const ISortAndFilterServiceSymbol = Symbol.for('ISortAndFilterService');

export interface ISortAndFilterService {
	/**
	 * Sorts and queries a list.
	 * @param list The list to sort and filter.
	 * @param query The text to filter by.
	 */
	createQueryList<T extends IFileInfo>(list: T[], query?: string): T[];

	/**
	 * Sorts and filters a list.
	 * @param list The list to sort and filter.
	 */
	filterList<T extends IFileInfo>(list: T[]): ReadonlySignal<T[]>;

	/**
	 * All available {@link IFilter}'s.
	 */
	filters: IFilter[];

	/**
	 * All active {@link IFilter}'s.
	 */
	activeFilters: Signal<IFilter[]>;
}
