import { injectable, multiInject, optional } from 'inversify';
import { type IIndexFetcher, IIndexFetcherSymbol } from '../Indexer';
import { IVersionService } from './IVersionService';

@injectable()
export class VersionService implements IVersionService {
	constructor(
		@multiInject(IIndexFetcherSymbol) @optional() private readonly indexers: IIndexFetcher<any>[] = []
	) { }

	getVersion(): string {
		return __VERSION__;
	}

	getIndexerVersions(): { name: string; version: string; }[] {
		return this.indexers.map(i => ({
			name: i.name,
			version: i.version
		}));
	}
}
