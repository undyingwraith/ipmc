import { ILibrary, IOnProgress } from 'ipmc-interfaces';

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

export interface IIndexFetcher<TIndex> {
	/**
	 * Fetches the index of the specified CID.
	 */
	fetchIndex(options: IFetchOptions<TIndex>): Promise<TIndex>;

	/**
	 * Checks wheter the indexer can handler specified {@link ILibrary}.
	 * @param library library to check compatibility for.
	 */
	canIndex(library: ILibrary): boolean;

	/**
	 * Version of the indexer.
	 */
	version: string;
}
