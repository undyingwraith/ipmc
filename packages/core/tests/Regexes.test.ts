import { describe, expect, test } from 'vitest';
import { Regexes } from '../src';

describe('Regexes', () => {
	test('Video file gets matches', () => {
		const res1 = Regexes.VideoFile.exec('Sample Movie (2015).mpd');
		expect(res1).not.toBeNull();
		expect(res1[0]).toEqual('Sample Movie (2015).mpd');
		expect(res1[1]).toEqual('Sample Movie');
		expect(res1[2]).toBe('2015');

		const res2 = Regexes.VideoFile.exec('Sample Movie.mpd');
		expect(res2).not.toBeNull();
		expect(res2[0]).toEqual('Sample Movie.mpd');
		expect(res2[1]).toEqual('Sample Movie');
		expect(res2[2]).toBe(undefined);
	});

	test('Thumbnail file gets matched', () => {
		expect(Regexes.Thumbnail.exec('thumb0.png')).not.toBeNull();
		expect(Regexes.Thumbnail.exec('Sample Movie (2015)-thumb0.png')).not.toBeNull();
		expect(Regexes.Thumbnail.exec('Sample Movie (2015)-thumb.jpg')).not.toBeNull();
		expect(Regexes.Thumbnail.exec('Sample Movie (2015)-thumb.jpeg')).not.toBeNull();
	});

	test('Poster file gets matched', () => {
		expect(Regexes.Poster.exec('poster.jpg')).not.toBeNull();
		expect(Regexes.Poster.exec('Sample Movie (2015)-poster.png')).not.toBeNull();
		expect(Regexes.Poster.exec('Sample Movie (2015)-poster.jpg')).not.toBeNull();
		expect(Regexes.Poster.exec('Sample Movie (2015)-poster.jpeg')).not.toBeNull();
	});
});
