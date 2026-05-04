import { Signal } from '@preact/signals-core';
import { IEpisodeMetadata, IIndexManager, IIndexManagerSymbol, ISeriesMetadata, ISortAndFilterServiceSymbol } from 'ipmc-interfaces';
import { Application, GlobalSearchService, IGlobalSearchService, IGlobalSearchServiceSymbol, SortAndFilterService } from 'src';
import { describe, expect, test } from 'vitest';

describe('GlobalSearchService', () => {
	const episode: IEpisodeMetadata = {
		title: 'A test episode',
		backdrops: [],
		cid: 'any',
		name: 'Season 01',
		pinId: 'any',
		posters: [],
		season: '1',
		series: '',
		type: 'dir',
		duration: 25,
		episode: '1',
		languages: ['eng'],
		resolution: 1080,
		subtitles: [],
		thumbnails: [],
		video: {
			cid: 'any',
			name: 'video.mpd',
			type: 'dir',
		}
	};
	const serie: ISeriesMetadata = {
		cid: 'any',
		name: 'Test',
		pinId: 'any',
		posters: [],
		backdrops: [],
		type: 'dir',
		title: 'test',
		items: [{
			backdrops: [],
			cid: 'any',
			name: 'Season 01',
			pinId: 'any',
			posters: [],
			season: '1',
			series: '',
			type: 'dir',
			items: [episode],
		}]
	};

	const app = new Application();
	app.register(GlobalSearchService, IGlobalSearchServiceSymbol);
	app.register(SortAndFilterService, ISortAndFilterServiceSymbol);
	app.registerConstant<IIndexManager>({
		indexes: new Map([['series', new Signal({
			indexer: 'a',
			cid: 'b',
			index: [serie],
		})]])
	}, IIndexManagerSymbol);


	test('Can find episodes of a series', () => {
		const service = app.getService<IGlobalSearchService>(IGlobalSearchServiceSymbol)!;

		const result = service.search('A test episode');

		expect(result).not.toBeUndefined();
		expect(result).to.include(episode);
	});
});
