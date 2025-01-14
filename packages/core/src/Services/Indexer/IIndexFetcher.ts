import { ILibrary, IOnProgress } from 'ipmc-interfaces';

export interface IIndexFetcher<TIndex> {
	/**
	 * Fetches the index of the specified CID.
	 * @param cid cid to index.
	 * @param abortSignal signal to abort the process.
	 * @param onProgress function to update progress.
	 */
	fetchIndex(cid: string, abortSignal: AbortSignal, onProgress: IOnProgress): Promise<TIndex>;

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
