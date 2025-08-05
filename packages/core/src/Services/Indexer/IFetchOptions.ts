import { IOnProgress } from 'ipmc-interfaces';

/**
 * The options to fetch an index.
 */
export interface IFetchOptions<TIndex> {
	/**
	 * Id of the library.
	 */
	libraryId: string;

	/**
	 * The old index if available.
	 */
	old?: TIndex;

	/**
	 * cid to index.
	 */

	cid: string;

	/**
	 * Signal to abort the process.
	 */
	abortSignal: AbortSignal;

	/**
	 * function to update progress.
	 */
	onProgress: IOnProgress;
}
