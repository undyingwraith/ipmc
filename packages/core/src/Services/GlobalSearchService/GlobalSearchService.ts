import { inject } from 'inversify';
import { IFileInfo, IIndexManager, IIndexManagerSymbol, ISortAndFilterService, ISortAndFilterServiceSymbol } from 'ipmc-interfaces';
import { IGlobalSearchService } from './IGlobalSearchService';

export class GlobalSearchService implements IGlobalSearchService {
	constructor(
		@inject(IIndexManagerSymbol) private readonly indexManager: IIndexManager,
		@inject(ISortAndFilterServiceSymbol) private readonly sortAndFilterService: ISortAndFilterService,
	) { }

	public search(query: string): IFileInfo[] {
		const allItems: IFileInfo[] = [];

		for (const [_, idx] of this.indexManager.indexes.entries()) {
			if (idx.value) {
				allItems.push(...idx.value.index);
			}
		}

		return this.sortAndFilterService.createFilteredList(allItems, query);
	}
}
