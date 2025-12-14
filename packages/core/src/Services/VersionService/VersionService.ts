import { injectable, multiInject } from 'inversify';
import { type IIndexFetcher, IIndexFetcherSymbol } from '../Indexer';
import { IVersionService } from './IVersionService';

@injectable()
export class VersionService implements IVersionService {
	constructor(
		@multiInject(IIndexFetcherSymbol) private readonly indexers: IIndexFetcher<any>[]
	) { }

	getVersion(): string {
		//TODO: fetch version from package.json or something
		return __VERSION__;
	}

	getIndexerVersions(): { name: string; version: string; }[] {
		return this.indexers.map(i => ({
			name: i.name,
			version: i.version
		}));
	}
}
