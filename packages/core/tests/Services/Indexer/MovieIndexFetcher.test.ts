import { IIndexManagerSymbol, IIpfsServiceSymbol, IKeyValueStoreSymbol, ILogServiceSymbol, IObjectStoreSymbol, IPersistentSignalServiceSymbol, IProfile, IProfileSymbol, ITaskManagerSymbol, ITranslationServiceSymbol } from 'ipmc-interfaces';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { Application, IIndexFetcherSymbol, IndexManager, LogService, MemoryKeyValueStore, MovieIndexFetcher, ObjectStore, PersistentSignalService, TaskManager, TranslationService } from '../../../src';
import { MockIpfsService } from '../../../testing';
import { createProfile, movieLibrary } from './data';

describe('MovieIndexFetcher', () => {
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
		app.registerMultiple(MovieIndexFetcher, IIndexFetcherSymbol);
		app.registerConstant<IProfile>(createProfile([movieLibrary]), IProfileSymbol);

		// Configure MockIpfsService
		const ipfs = app.getService<MockIpfsService>(IIpfsServiceSymbol)!;
		ipfs.cids = {
			sampleCid1: [
				{
					cid: 'movieCid1',
					name: 'Movie 1 (2000)',
					type: 'dir',
				},
			],
			sampleCid2: [
				{
					cid: 'movieCid1',
					name: 'Movie 1 (2000)',
					type: 'dir',
				},
				{
					cid: 'movieCid2',
					name: 'Movie 2 (2000)',
					type: 'dir',
				},
			],
			// Movie 1
			movieCid1: [
				{
					cid: 'movieFileCid1',
					name: 'Movie 1 (2000).mpd',
					type: 'file',
				}
			],
			movieFileCid1: new TextEncoder().encode(`<?xml version="1.0" encoding="UTF-8"?>
<MPD xmlns="urn:mpeg:dash:schema:mpd:2011" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:mpeg:dash:schema:mpd:2011 DASH-MPD.xsd" profiles="urn:mpeg:dash:profile:isoff-live:2011" minBufferTime="PT2S" type="static" mediaPresentationDuration="PT5569.146973S">
  <Period id="0">
    <AdaptationSet id="0" contentType="audio" lang="en" startWithSAP="1" segmentAlignment="true">
      <Representation id="0" bandwidth="387167" codecs="mp4a.40.2" mimeType="audio/mp4" audioSamplingRate="48000">
        <AudioChannelConfiguration schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011" value="6"/>
        <SegmentTemplate timescale="48000" initialization="audio/init.mp4" media="audio/$Number$.mp4" startNumber="1">
        </SegmentTemplate>
      </Representation>
    </AdaptationSet>
    <AdaptationSet id="1" contentType="video" width="1920" height="800" frameRate="24000/1001" segmentAlignment="true" par="12:5">
      <SupplementalProperty schemeIdUri="urn:mpeg:mpegB:cicp:TransferCharacteristics" value="1"/>
      <Representation id="1" bandwidth="9525158" codecs="avc1.640029" mimeType="video/mp4" sar="1:1">
        <SegmentTemplate timescale="24000" initialization="video/init.mp4" media="video/$Number$.mp4" startNumber="1">
        </SegmentTemplate>
      </Representation>
    </AdaptationSet>
    <AdaptationSet id="2" contentType="text" lang="en" segmentAlignment="true">
      <Role schemeIdUri="urn:mpeg:dash:role:2011" value="subtitle"/>
      <Representation id="2" bandwidth="832" codecs="wvtt" mimeType="application/mp4">
        <SegmentTemplate timescale="1000" initialization="subs/en/init.mp4" media="subs/en/$Number$.mp4" startNumber="1">
          <SegmentTimeline>
            <S t="0" d="6000" r="846"/>
          </SegmentTimeline>
        </SegmentTemplate>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>
`) as Uint8Array<ArrayBuffer>,
			// Movie 2
			movieCid2: [
				{
					cid: 'movieFileCid2',
					name: 'Movie 2 (2000).mpd',
					type: 'file',
				}
			],
			movieFileCid2: new TextEncoder().encode(`<?xml version="1.0" encoding="UTF-8"?>
<MPD xmlns="urn:mpeg:dash:schema:mpd:2011" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:mpeg:dash:schema:mpd:2011 DASH-MPD.xsd" profiles="urn:mpeg:dash:profile:isoff-live:2011" minBufferTime="PT2S" type="static" mediaPresentationDuration="PT5569.146973S">
  <Period id="0">
    <AdaptationSet id="0" contentType="audio" lang="en" startWithSAP="1" segmentAlignment="true">
      <Representation id="0" bandwidth="387167" codecs="mp4a.40.2" mimeType="audio/mp4" audioSamplingRate="48000">
        <AudioChannelConfiguration schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011" value="6"/>
        <SegmentTemplate timescale="48000" initialization="audio/init.mp4" media="audio/$Number$.mp4" startNumber="1">
        </SegmentTemplate>
      </Representation>
    </AdaptationSet>
    <AdaptationSet id="1" contentType="video" width="1920" height="800" frameRate="24000/1001" segmentAlignment="true" par="12:5">
      <SupplementalProperty schemeIdUri="urn:mpeg:mpegB:cicp:TransferCharacteristics" value="1"/>
      <Representation id="1" bandwidth="9525158" codecs="avc1.640029" mimeType="video/mp4" sar="1:1">
        <SegmentTemplate timescale="24000" initialization="video/init.mp4" media="video/$Number$.mp4" startNumber="1">
        </SegmentTemplate>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>
`) as Uint8Array<ArrayBuffer>,
		};
		ipfs.ipns = { [movieLibrary.upstream]: 'sampleCid1' };
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test('Indexes Movies', async () => {
		const indexer = app.getService<IndexManager>(IIndexManagerSymbol)!;
		await indexer.updateLibrary(movieLibrary, new AbortController().signal, () => { });

		expect(indexer.indexes.get(movieLibrary.id)).toBeDefined();
		expect(indexer.indexes.get(movieLibrary.id)?.value).toBeDefined();
		expect(indexer.indexes.get(movieLibrary.id)?.value?.index.length).toBe(1);
	});

	test('Does not refresh unchanged metadata', async () => {
		const indexer = app.getService<IndexManager>(IIndexManagerSymbol)!;
		const ipfs = app.getService<MockIpfsService>(IIpfsServiceSymbol)!;
		ipfs.ipns = { 'movies.sample': 'sampleCid1' };

		const spy1 = vi.spyOn(ipfs, 'ls');

		// Run initial indexing
		await indexer.updateLibrary(movieLibrary, new AbortController().signal, () => { });
		expect(spy1).toHaveBeenCalledWith('sampleCid1', expect.anything());
		expect(spy1).toHaveBeenCalledWith('movieCid1', expect.anything());

		ipfs.ipns = { 'movies.sample': 'sampleCid2' };
		vi.restoreAllMocks();
		const spy2 = vi.spyOn(ipfs, 'ls');

		// Run update
		await indexer.updateLibrary(movieLibrary, new AbortController().signal, () => { });

		//expect(spy2).toHaveBeenCalledTimes(2);
		expect(spy2).toHaveBeenCalledWith('sampleCid2', expect.anything());
		expect(spy2).toHaveBeenCalledWith('movieCid2', expect.anything());
		expect(spy2).not.toHaveBeenCalledWith('sampleCid1', expect.anything());
		expect(spy2).not.toHaveBeenCalledWith('movieCid1', expect.anything());
	});

	test('Reports progress', async () => {
		const indexer = app.getService<IndexManager>(IIndexManagerSymbol)!;

		const onProgress = vi.fn().mockImplementation(() => { });

		await indexer.updateLibrary(movieLibrary, new AbortController().signal, onProgress);

		expect(onProgress).toBeCalledTimes(2);
		expect(onProgress).toHaveBeenCalledWith(0, 1);
		expect(onProgress).toHaveBeenLastCalledWith(1, 1);
	});
});
