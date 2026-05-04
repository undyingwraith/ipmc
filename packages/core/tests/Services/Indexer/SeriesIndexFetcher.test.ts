import { IEpisodeMetadata, IIndexManagerSymbol, IIpfsServiceSymbol, IKeyValueStoreSymbol, ILogServiceSymbol, IObjectStoreSymbol, IPersistentSignalServiceSymbol, IProfile, IProfileSymbol, ITaskManagerSymbol, ITranslationServiceSymbol } from 'ipmc-interfaces';
import { Application } from 'src';
import { IIndexFetcherSymbol, IndexManager, LogService, MemoryKeyValueStore, ObjectStore, PersistentSignalService, SeriesIndexFetcher, TaskManager, TranslationService } from 'src/Services';
import { MockIpfsService } from 'testing';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createProfile, seriesLibrary, videoFile1, videoFile2 } from './data';

describe('SeriesIndexFetcher', () => {
	let app: Application;

	beforeEach(() => {
		app = new Application();
		app.register(IndexManager, IIndexManagerSymbol);
		app.register(MockIpfsService, IIpfsServiceSymbol);
		app.register(ObjectStore, IObjectStoreSymbol);
		app.register(MemoryKeyValueStore, IKeyValueStoreSymbol);
		app.register(TaskManager, ITaskManagerSymbol);
		app.register(LogService, ILogServiceSymbol);
		app.register(TranslationService, ITranslationServiceSymbol);
		app.register(PersistentSignalService, IPersistentSignalServiceSymbol);
		app.registerMultiple(SeriesIndexFetcher, IIndexFetcherSymbol);
		app.registerConstant<IProfile>(createProfile([seriesLibrary]), IProfileSymbol);

		const ipfs = app.getService<MockIpfsService>(IIpfsServiceSymbol)!;
		const start = ipfs.createData({
			name: 't',
			content: [
				{
					name: 'Sample Series',
					content: [
						{
							name: 'Season 01',
							content: [
								{
									name: 'Sample Series - S01E01 - Title',
									content: [
										{
											name: 'Sample Series - S01E01 - Title.mpd',
											content: videoFile1,
										},
									]
								},
								{
									name: 'Sample Series - S01E02',
									content: [
										{
											name: 'Sample Series - S01E02.mpd',
											content: videoFile2,
										},
									]
								},
							]
						},
					]
				}
			]
		});
		ipfs.ipns = { [seriesLibrary.upstream]: start };
	});


	afterEach(() => {
		vi.restoreAllMocks();
	});

	test('Indexes Series', async () => {
		const indexer = app.getService<IndexManager>(IIndexManagerSymbol)!;
		await indexer.updateLibrary(seriesLibrary, new AbortController().signal, () => { });

		const idx = indexer.indexes.get(seriesLibrary.id)!;
		expect(idx).toBeDefined();
		expect(idx.value).toBeDefined();
		expect(idx.value?.index.length, 'contains one series').toBe(1);

		const series = idx.value!.index[0];
		expect(series.title, 'parses series name').toBe('Sample Series');
		expect(series.items.length, 'contains one season').toBe(1);

		const season1 = series.items[0];
		expect(season1.items.length, 'contains two episodes').toBe(2);

		const episode1 = season1.items[0] as IEpisodeMetadata;
		expect(episode1.series, 'parses series name').toBe('Sample Series');
		expect(episode1.season, 'season number gets parsed').toBe('01');
		expect(episode1.episode, 'episode number gets parsed').toBe('01');
		expect(episode1.title, 'title gets parsed').toBe('Title');

		const episode2 = season1.items[1] as IEpisodeMetadata;
		expect(episode2.season, 'season number gets parsed').toBe('01');
		expect(episode2.episode, 'episode number gets parsed').toBe('02');
	});
});
