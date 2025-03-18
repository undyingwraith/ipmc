import { HasTitle, HasYear, IFileInfo, ISortAndFilterService, ISortAndFilterServiceSymbol } from 'ipmc-interfaces';
import { describe, expect, test } from 'vitest';
import { Application, SortAndFilterService, uuid } from '../../src';

type TMeta = (IFileInfo & HasTitle & HasYear);

function createMovie(title: string, year: number, cid?: string): TMeta {
	return {
		cid: cid ?? uuid(),
		name: `${title} (${year})`,
		title,
		year,
		type: 'dir',
	};
}

describe('SortAndFilterService', () => {
	const app = new Application();
	app.register(SortAndFilterService, ISortAndFilterServiceSymbol);

	test('Case insensitive search works', () => {
		const list: TMeta[] = [
			createMovie('Test Movie', 2016),
			createMovie('Test Movie 2', 2020),
			createMovie('Something Else', 2020),
			createMovie('The Something Else', 2021),
		];
		const service = app.getService<ISortAndFilterService>(ISortAndFilterServiceSymbol)!;
		const filtered = service.createFilteredList(list, 'test movie');

		expect(filtered.length).toBe(2);
	});

	test('Sorting ingores leading \'The\'', () => {
		const list: TMeta[] = [
			createMovie('B', 2020),
			createMovie('The A', 2021),
		];
		const service = app.getService<ISortAndFilterService>(ISortAndFilterServiceSymbol)!;
		const filtered = service.createFilteredList(list);

		expect(filtered[0].title).toBe('The A');
		expect(filtered[1].title).toBe('B');
	});

	test('Sorts by title then year', () => {
		const list: TMeta[] = [
			createMovie('B', 1999),
			createMovie('A', 2021),
			createMovie('A', 2020),
		];
		const service = app.getService<ISortAndFilterService>(ISortAndFilterServiceSymbol)!;
		const filtered = service.createFilteredList(list);

		expect(filtered[0].title).toBe('A');
		expect(filtered[0].year).toBe(2020);
		expect(filtered[1].title).toBe('A');
		expect(filtered[1].year).toBe(2021);
		expect(filtered[2].title).toBe('B');
	});
});
