import { inject } from 'inversify';
import { IFileInfo, type IIndexManager, IIndexManagerSymbol } from 'ipmc-interfaces';
import { type IGlobalSearchService } from './IGlobalSearchService';
import { type ISortAndFilterService, ISortAndFilterServiceSymbol } from '../SortAndFilterService';

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

		return this.sortAndFilterService.createQueryList(allItems, query);
	}
}
