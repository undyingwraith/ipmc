import { confirm, input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import fs from 'fs';
import { Regexes } from 'ipmc-core';
import { create, globSource } from 'kubo-rpc-client';
import path, { basename } from 'path';
import srt2vtt from 'srt2vtt';
import { ITempDir, tempDir } from '../utils/tempDIr';
import { IStream } from './IStream';
import { detectStreams } from './detectStreams';
import { packageStreams } from './packageStreams';

type IConverter = (file: string, temp: ITempDir) => Promise<string>;

const nullConverter: IConverter = (s) => Promise.resolve(s);
const converters: { [key: string]: IConverter; } = {
	'mp4': nullConverter,
	'webvtt': nullConverter,
	'srt': async (file, temp) => {
		const srtData = fs.readFileSync(file);
		return await new Promise((resolve, reject) => {
			srt2vtt(srtData, (err, vttData) => {
				if (err) {
					reject(err);
				} else {
					const fn = path.join(temp.getPath(), basename(file, 'srt') + 'vtt');
					fs.writeFileSync(fn, vttData);
					resolve(fn);
				}
			});
		});
	}
};

async function getMovieMetadata(files: string[]): Promise<{ year: string; title: string; fileName: string; }> {
	const movieData = files.map(file => Regexes.VideoFile('mp4').exec(path.basename(file))).find(r => r != null);

	const title = await input({ message: 'Movie title?', default: movieData != null ? movieData[1] : undefined, required: true });
	const year = await input({ message: 'Year?', default: movieData != null ? movieData[2] : undefined, required: true });

	return {
		title,
		year,
		fileName: `${title} (${year})`
	};
}

async function getEpisodeMetadata(files: string[]): Promise<{ seriesTitle: string; fileName: string; season: string; episode: string; episodeTitle?: string; }> {
	function zeroPad(input: string) {
		return String(input).padStart(2, '0');
	}
	const seriesTitle = await input({ message: 'Series title?', required: true });
	const season = await input({ message: 'Season?', default: '1', required: true });
	const episode = await input({ message: 'Episode?', default: '1', required: true });
	const episodeTitle = await input({ message: 'Episode title?', required: false });

	return {
		seriesTitle,
		season,
		episode,
		episodeTitle,
		fileName: `${seriesTitle} - S${zeroPad(season)}E${zeroPad(episode)}${episodeTitle && episodeTitle !== '' ? ` - ${episodeTitle}` : ''}`
	};
}

export async function importFiles(files: string[], packager: string, ipfs: string) {
	const temp = tempDir();
	const outDir = tempDir();

	try {
		const streams: IStream[] = [];
		const otherFiles: string[] = [];
		for (const file of files) {
			const converter = Object.entries(converters).find(([k, _]) => file.endsWith(`.${k}`));
			if (converter) {
				const actualFile = await converter[1](file, temp);
				const streamsFromFile = await detectStreams(packager, actualFile);
				streams.push(...streamsFromFile);
			} else if (['png', 'jpg', 'jpeg'].some(k => file.endsWith(`.${k}`))) {
				otherFiles.push(file);
			}
		}

		console.log(`Detected ${streams.length} streams and ${otherFiles.length} other files, from ${files.length} files!`);

		const mediaType = await select({
			message: 'Media Type',
			choices: [
				'Movie',
				'Episode',
			]
		});
		const metaData = await (mediaType === 'Movie' ? getMovieMetadata(files) : getEpisodeMetadata(files));

		for (const stream of streams) {
			const streamDisplayName = `${stream.id}|${stream.type}|${path.basename(stream.file)}`;

			if (stream.type !== 'Video') {
				stream.lang = await input({
					message: `[${streamDisplayName}] Language?`,
					default: stream.lang,
					required: true,
					validate: (input) => Regexes.LangCheck.exec(input) != null
				});
			}

			if (stream.type === 'Text') {
				stream.forced = await confirm({
					message: `[${streamDisplayName}] Forced?`,
					default: false,
				});
			}
		}

		for (const file of otherFiles) {
			const use = await confirm({
				message: `[${file}] Use file?`,
				default: true,
			});

			if (use) {
				if (['png', 'jpg', 'jpeg'].some(k => file.endsWith(`.${k}`))) {
					const imageType = await select({
						message: 'Image Type',
						choices: [
							'Poster',
						]
					});

					switch (imageType) {
						case 'Poster':
							fs.copyFileSync(file, path.join(outDir.getPath(), `${metaData.fileName}-poster.${file.substring(file.lastIndexOf('.') + 1)}`));
							break;
					}
				}
			}
		}

		console.log('Packaging...');
		await packageStreams(packager, metaData.fileName, streams, outDir);
		console.log('Streams packaged!');

		const node = create({ url: ipfs });
		for await (const file of node.addAll(globSource(outDir.getPath(), '**'), {
			pin: false,
			wrapWithDirectory: true
		})) {
			if (file.path === '') {
				console.log(`Added to ipfs ${chalk.green(file.cid)}`);
				console.log(`Item ${chalk.blue(metaData.fileName)}`);
			}
		}
	} finally {
		outDir.clean();
		temp.clean();
	}
}
