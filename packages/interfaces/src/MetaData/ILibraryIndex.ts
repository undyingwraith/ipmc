/**
 * An index of a {@link ILibrary}.
 */
export interface ILibraryIndex<TValues> {
	/**
	 * The version of the indexer that created this.
	 */
	indexer: string;

	/**
	 * The {@link CID} that was used to generate the index.
	 */
	cid: string;

	/**
	 * The generated index.
	 */
	index: TValues[];
}
