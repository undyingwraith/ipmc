import { create, globSource } from 'kubo-rpc-client';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { exec } from 'child_process';
import { input, confirm, select } from '@inquirer/prompts';
import { ITempDir, tempDir } from './utils/tempDIr';
import chalk from 'chalk';
import { partitionArray, Regexes } from 'ipmc-core';
import path, { basename } from 'path';
import srt2vtt from 'srt2vtt';
import fs from 'fs';

type TStream = 'Video' | 'Audio' | 'Text';

interface IStream {
	type: TStream;
	id: number;
	lang?: string;
	file: string;
	forced?: boolean;
}

async function detectStreams(packager: string, file: string): Promise<IStream[]> {
	return new Promise((resolve, reject) => {
		exec(`${packager} input="${file}" --dump_stream_info`, (error, stdout, stderr) => {
			if (error) {
				console.error(stderr);
				reject(error);
			} else {
				//console.debug(stdout);
				const regex = /Stream \[(\d+)\] type: (\w+)\r?\n((?: [\w_]+: .+\r?\n)+)\r?\n/gm;
				const matches = stdout.matchAll(regex);
				const streams: IStream[] = [];

				for (const match of matches) {
					const stream: IStream = {
						type: match[2] as TStream,
						id: parseInt(match[1]),
						file: file
					};

					const langResult = /language: (\w+)/.exec(match[0]);
					if (langResult && langResult[1] !== 'und') {
						stream.lang = langResult[1];
					}

					streams.push(stream);
				}

				resolve(streams);
			}
		});
	});
}

async function packageStreams(packager: string, title: string, streams: IStream[], workdir: ITempDir): Promise<void> {
	const folder = workdir.getPath();
	function mapStream(s: IStream): string {
		const segmentDir = `${folder}/${s.type.toLowerCase()}${s.type == 'Video' || !s.lang ? '' : '/' + s.lang + (s.forced ? '.forced' : '')}`;
		const options: { [key: string]: string; } = {
			in: s.file,
			stream: s.type.toLowerCase(),
			init_segment: `${segmentDir}/init.mp4`,
			segment_template: `${segmentDir}/$Number$.mp4`,
		};
		if (s.lang) {
			options.lang = s.lang;
		}
		if (s.type === 'Text' && s.forced !== undefined) {
			options.forced_subtitle = s.forced ? '1' : '0';
		}
		return `"${Object.entries(options).map(([key, value]) => key + '=' + value).join(',')}"`;
	}
	return new Promise((resolve, reject) => {
		exec(`${packager} ${streams.map(mapStream).join(' ')} --generate_static_live_mpd --mpd_output "${folder}/${title}.mpd"`, (error, stdout, stderr) => {
			if (error) {
				console.error(stderr);
				reject(error);
			} else {
				console.log(stdout);
				resolve();
			}
		});
	});
}

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

async function importFiles(files: string[]) {
	const temp = tempDir();
	const outDir = tempDir();

	try {
		const streams: IStream[] = [];
		const otherFiles: string[] = [];
		for (const file of files) {
			const converter = Object.entries(converters).find(([k, _]) => file.endsWith(`.${k}`));
			if (converter) {
				const actualFile = await converter[1](file, temp);
				const streamsFromFile = await detectStreams(args.packager, actualFile);
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
		await packageStreams(args.packager, metaData.fileName, streams, outDir);
		console.log('Streams packaged!');

		const node = create({ url: args.ipfs });
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

const args = yargs(hideBin(process.argv))
	.option('packager', {
		alias: 'p',
		describe: 'packager executable to use',
		default: 'shaka-packager',
	})
	.option('ipfs', {
		describe: 'ipfs api url',
		default: 'http://127.0.0.1:5002/api/v0'
	})
	.array('file')
	.alias('file', 'f')
	.demandOption(['file'])
	.help()
	.parseSync();

(async () => {
	const paths = args.file as string[];

	const [directories, files] = partitionArray(paths, path => fs.lstatSync(path).isDirectory());

	for (const dir of directories) {
		await importFiles(fs.readdirSync(dir).map(name => path.join(dir, name)));
	}

	if (files.length > 0) {
		await importFiles(files);
	}

	console.log('Done!');
})();

