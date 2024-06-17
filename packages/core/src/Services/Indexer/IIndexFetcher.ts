export interface IIndexFetcher<TIndex> {
	fetchIndex(): Promise<TIndex>;
	version: string;
}
