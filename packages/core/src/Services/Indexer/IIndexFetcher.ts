import { ILibrary, IOnProgress } from 'ipmc-interfaces';

export interface IIndexFetcher<TIndex> {
	/**
	 * Fetches the index of the specified CID.
	 * @param cid cid to index.
	 * @param onProgress function to update progress.
	 */
	fetchIndex(cid: string, onProgress: IOnProgress): Promise<TIndex>;

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
