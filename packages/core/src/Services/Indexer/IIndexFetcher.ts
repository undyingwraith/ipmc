export interface IIndexFetcher<TIndex> {
	fetchIndex(cid: string): Promise<TIndex>;
	version: string;
}
