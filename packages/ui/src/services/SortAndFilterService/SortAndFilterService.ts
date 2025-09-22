import { computed, ReadonlySignal, Signal } from '@preact/signals-react';
import { injectable, multiInject, optional } from 'inversify';
import { IFileInfo, isTitleFeature, isYearFeature } from 'ipmc-interfaces';
import { IFilter, IFilterSymbol } from './IFilter';
import { ISortAndFilterService } from './ISortAndFilterService';

type IMatcher = (v: any, w: string) => boolean;

@injectable()
export class SortAndFilterService implements ISortAndFilterService {
	constructor(
		@multiInject(IFilterSymbol) @optional() public readonly filters: IFilter[] = []
	) {
		this.sort = this.sort.bind(this);
		this.compare = this.compare.bind(this);
	}

	createQueryList<T extends IFileInfo>(list: T[], query?: string): T[] {
		if (query === undefined || query.trim() === '') {
			return list.sort(this.sort);
		}

		const matchers: IMatcher[] = [
			(v, w) => v.name.toLowerCase().includes(w),
			(v, w) => isTitleFeature(v) && v.title.toLowerCase().includes(w),
			(v, w) => isYearFeature(v) && v.year.toString() === w,
		];

		const words = query.toLowerCase().split(' ');
		const matchScore = 2;

		const ranked = list.map(v => {
			let score = 0;

			for (const w of words) {
				if (matchers.some((m) => m(v, w))) {
					score += matchScore + w.length;
				}
			}

			return ({
				score: score,
				item: v
			});
		});

		const maxScore = words.reduce((total, v) => total + v.length, words.length * matchScore);
		const threshold = 50;

		return ranked
			.filter(i => i.score > (maxScore / 100) * threshold)
			.sort((a, b) => a.score === b.score ? this.sort(a.item, b.item) : b.score - a.score)
			.map(i => i.item);
	}

	public filterList<T extends IFileInfo>(list: T[]): ReadonlySignal<T[]> {
		return computed(() => {
			let result = computed(() => list.sort(this.sort));
			for (const filter of this.activeFilters.value) {
				result = filter.apply(result);
			}
			return result.value;
		});
	}

	private sort(a: IFileInfo, b: IFileInfo): number {
		const sort = isTitleFeature(a) && isTitleFeature(b) ? this.compare(a.title, b.title) : this.compare(a.name, b.name);
		return sort === 0 && isYearFeature(a) && isYearFeature(b) ? a.year - b.year : sort;
	}

	private compare(a: string, b: string): number {
		const matcher = /^the /i;
		return a.replace(matcher, '').localeCompare(b.replace(matcher, ''));
	}

	public activeFilters = new Signal<IFilter[]>([]);
}
