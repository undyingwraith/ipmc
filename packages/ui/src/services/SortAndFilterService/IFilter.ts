import { ReadonlySignal } from '@preact/signals-core';
import { IFileInfo } from 'ipmc-interfaces';

export const IFilterSymbol = Symbol.for('IFilter');

export interface IFilter {
	/**
	 * Translation key to be used.
	 */
	name: string;

	/**
	 * Render function for the component.
	 */
	render(): any;

	/**
	 * Filter function the be used when filter is active.
	 * @param list the list to be filtered.
	 */
	apply<T extends IFileInfo>(list: ReadonlySignal<T[]>): ReadonlySignal<T[]>;
}
