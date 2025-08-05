import { ReadonlySignal } from '@preact/signals-core';
import { ILibraryIndex } from '../MetaData';

export const IIndexManagerSymbol = Symbol.for('IIndexManager');

export interface IIndexManager {
	/**
	 * Currently available indexes.
	 */
	indexes: Map<string, ReadonlySignal<ILibraryIndex<any> | undefined>>;
}
