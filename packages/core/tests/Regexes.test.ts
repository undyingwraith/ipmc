import { describe, expect, test } from 'vitest';
import { Regexes } from '../src';

describe('Regexes', () => {
	test('Video file gets matches', () => {
		const res1 = Regexes.VideoFile('mpd').exec('Sample Movie (2015).mpd');
		expect(res1).not.toBeNull();
		expect(res1![0]).toEqual('Sample Movie (2015).mpd');
		expect(res1![1]).toEqual('Sample Movie');
		expect(res1![2]).toBe('2015');

		const res2 = Regexes.VideoFile('mpd').exec('Sample Movie.mpd');
		expect(res2).not.toBeNull();
		expect(res2![0]).toEqual('Sample Movie.mpd');
		expect(res2![1]).toEqual('Sample Movie');
		expect(res2![2]).toBe(undefined);

		const res3 = Regexes.VideoFile('mpd').exec('Sample Movie: Subtitle (2015).mpd');
		expect(res3).not.toBeNull();
		expect(res3![0]).toEqual('Sample Movie: Subtitle (2015).mpd');
		expect(res3![1]).toEqual('Sample Movie: Subtitle');
		expect(res3![2]).toBe('2015');

		const res4 = Regexes.VideoFile('mpd').exec('Sample\'s Movie! Vol.2 (2015).mpd');
		expect(res4).not.toBeNull();
		expect(res4![0]).toEqual('Sample\'s Movie! Vol.2 (2015).mpd');
		expect(res4![1]).toEqual('Sample\'s Movie! Vol.2');
		expect(res4![2]).toBe('2015');

		const res5 = Regexes.VideoFile('mpd').exec('Sample Movie - Subtitle (2015).mpd');
		expect(res5).not.toBeNull();
		expect(res5![0]).toEqual('Sample Movie - Subtitle (2015).mpd');
		expect(res5![1]).toEqual('Sample Movie - Subtitle');
		expect(res5![2]).toBe('2015');
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

	test('Language check is valid', () => {
		expect(Regexes.LangCheck.exec('de')).not.toBeNull();
		expect(Regexes.LangCheck.exec('i-enochian')).not.toBeNull();
		expect(Regexes.LangCheck.exec('zh-Hant')).not.toBeNull();
		expect(Regexes.LangCheck.exec('zh-cmn-Hans-CN')).not.toBeNull();
		expect(Regexes.LangCheck.exec('zh-Hans-CN')).not.toBeNull();
		expect(Regexes.LangCheck.exec('sl-rozaj')).not.toBeNull();
		expect(Regexes.LangCheck.exec('sl-rozaj-biske')).not.toBeNull();
		expect(Regexes.LangCheck.exec('de-CH-1901')).not.toBeNull();
		expect(Regexes.LangCheck.exec('sl-IT-nedis')).not.toBeNull();
		expect(Regexes.LangCheck.exec('de-DE')).not.toBeNull();
		expect(Regexes.LangCheck.exec('es-419')).not.toBeNull();
		expect(Regexes.LangCheck.exec('de-CH-x-phonebk')).not.toBeNull();
		expect(Regexes.LangCheck.exec('az-Arab-x-AZE-derbend')).not.toBeNull();
		expect(Regexes.LangCheck.exec('x-whatever')).not.toBeNull();
		expect(Regexes.LangCheck.exec('qaa-Qaaa-QM-x-southern')).not.toBeNull();
		expect(Regexes.LangCheck.exec('de-Qaaa')).not.toBeNull();
	});
});
