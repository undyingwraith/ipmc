import { Application, CoreModule, LogService } from 'ipmc-core';
import { IIpfsServiceSymbol, ILogServiceSymbol, IVideoFile } from 'ipmc-interfaces';
import { IMediaPlayerService, IMediaPlayerServiceSymbol, IPlayerServiceSymbol, MediaPlayerService, VideoPlayerService } from 'src/services';
import { beforeEach, describe, expect, test } from 'vitest';

describe('MediaPlayerService', () => {
	let app: Application;
	const testFile: IVideoFile = {
		cid: 'test',
		languages: [],
		name: 'testName',
		subtitles: [],
		thumbnails: [],
		type: 'dir',
		video: {
			cid: 'testCidVideo',
			name: 'testVideoName',
			type: 'file',
		},
		resolution: 0,
		duration: 0,
	};
	const testFile2 = {
		...testFile,
		cid: 'test2',
	};

	beforeEach(() => {
		app = new Application();
		app.use(CoreModule);
		app.register(MediaPlayerService, IMediaPlayerServiceSymbol);
		app.register(VideoPlayerService, IPlayerServiceSymbol);
		app.registerConstant({}, IIpfsServiceSymbol);
		app.register(LogService, ILogServiceSymbol);
	});

	test('Can enqueue an item', () => {
		const player = app.getService<IMediaPlayerService>(IMediaPlayerServiceSymbol)!;

		player.enqueue(testFile);

		expect(player.nowPlaying.value).not.toBeUndefined();
		expect(player.queueIndex.value).toBe(0);
		expect(player.queue.value.length).toBe(1);
	});

	test('Can enqueueNext', () => {
		const player = app.getService<IMediaPlayerService>(IMediaPlayerServiceSymbol)!;

		player.enqueue(testFile);
		player.enqueue(testFile);
		player.enqueueNext(testFile2);

		expect(player.nowPlaying.value).not.toBeUndefined();
		expect(player.queueIndex.value).toBe(0);
		expect(player.queue.value.length).toBe(3);
		expect(player.queue.value[player.queueIndex.value + 1].cid).toBe('test2');
	});
}); 
