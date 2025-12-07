import { ILibrary } from 'ipmc-interfaces';
import { IFetchOptions } from './IFetchOptions';

export const IIndexFetcherSymbol = Symbol.for('IIndexFetcher');

/**
 * A class that fetches a index of type {@link TIndex}.
 */
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
	get version(): string;

	/**
	 * Name of the indexer.
	 */
	get name(): string;
}
