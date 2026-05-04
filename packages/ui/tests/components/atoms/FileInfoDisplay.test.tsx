import { render } from '@testing-library/react';
import { BrowserModule, CoreModule } from 'ipmc-core';
import { IFileInfo, IIpfsServiceSymbol, IMovieMetaData } from 'ipmc-interfaces';
import React from 'react';
import { FileInfoDisplay } from 'src/components/atoms';
import { AppContextProvider } from 'src/context';
import { IMediaPreferenceServiceSymbol, IObjectUrlControllerSymbol, MediaPreferenceService, ObjectUrlController } from 'src/services';
import { describe, expect, test } from 'vitest';

describe('FileInfoDisplay', () => {
	test('Renders a Movie correctly', () => {
		const movie: IMovieMetaData = {
			cid: 'movieCid',
			backdrops: [],
			name: 'Test Movie',
			type: 'dir',
			duration: 25,
			languages: ['eng'],
			pinId: 'movieCid',
			resolution: 1080,
			title: 'Test Movie',
			subtitles: [],
			posters: [],
			thumbnails: [],
			year: 2000,
			video: {
				name: 'Test Movie.mpd',
				cid: 'test',
				type: 'file',
			}
		};

		const t = render(
			<AppContextProvider setup={(app) => {
				app.use(CoreModule);
				app.use(BrowserModule);
				app.registerConstant({}, IIpfsServiceSymbol);
				app.register(MediaPreferenceService, IMediaPreferenceServiceSymbol);
				app.register(ObjectUrlController, IObjectUrlControllerSymbol);
			}}>
				<FileInfoDisplay file={movie} />
			</AppContextProvider>);
		expect(t.asFragment()).toMatchSnapshot();
	});

	test('Renders data', () => {
		const fileInfo: IFileInfo = {
			cid: 'TestCid',
			name: 'Test name',
			type: 'dir'
		};

		const t = render(
			<AppContextProvider setup={(app) => {
				app.use(CoreModule);
				app.use(BrowserModule);
				app.registerConstant({}, IIpfsServiceSymbol);
				app.register(MediaPreferenceService, IMediaPreferenceServiceSymbol);
				app.register(ObjectUrlController, IObjectUrlControllerSymbol);
			}}>
				<FileInfoDisplay file={fileInfo} />
			</AppContextProvider>);
		expect(t.asFragment()).toMatchSnapshot();
	});
});
