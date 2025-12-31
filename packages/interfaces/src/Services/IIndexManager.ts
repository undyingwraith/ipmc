import { ReadonlySignal } from '@preact/signals-core';
import { ILibrary, ILibraryIndex } from '../MetaData';
import { IOnProgress } from './ITaskManager';

export const IIndexManagerSymbol = Symbol.for('IIndexManager');

export interface IIndexManager {
	/**
	 * Currently available indexes.
	 */
	indexes: Map<string, ReadonlySignal<ILibraryIndex<any> | undefined>>;

	/**
	 * Updates the specified index.
	 * @param library the library to update.
	 * @param options options that specify how the library should be updated.
	 */
	update(library: ILibrary, options?: Partial<IUpdateOptions>): Promise<void>;
}

/**
 * Options for a {@link ILibrary} update.
 */
export interface IUpdateOptions {
	/**
	 * {@link AbortSignal} to abort update process.
	 */
	signal: AbortSignal;

	/**
	 * A function to be called when the update makes progress.
	 */
	onProgress: IOnProgress;

	/**
	 * Do a full index even if nothing has changed.
	 * @default false
	 */
	force: boolean;
}
