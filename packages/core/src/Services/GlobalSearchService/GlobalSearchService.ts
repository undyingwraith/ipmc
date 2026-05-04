import { inject } from 'inversify';
import { IFileInfo, IIndexManager, IIndexManagerSymbol, isIFolderFile, ISortAndFilterService, ISortAndFilterServiceSymbol } from 'ipmc-interfaces';
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
				allItems.push(...idx.value.index.map(i => this.getChildren(i)).flat());
			}
		}

		return this.sortAndFilterService.createFilteredList(allItems, query);
	}

	private getChildren(item: IFileInfo): IFileInfo[] {
		if (isIFolderFile(item)) {
			return [item, ...item.items.map(i => this.getChildren(i)).flat()];
		}
		return [item];
	}
}
