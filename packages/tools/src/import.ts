import { create, globSource } from 'kubo-rpc-client';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { exec } from 'child_process';
import { input, confirm } from '@inquirer/prompts';
import { ITempDir, tempDir } from './utils/tempDIr';
import chalk from 'chalk';
import { Regexes } from 'ipmc-core';
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
		const segmentDir = `${folder}/${s.type.toLowerCase()}${s.type == 'Video' || !s.lang ? '' : '/' + s.lang}`;
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
	const files = args.file as string[];

	const temp = tempDir();
	const outDir = tempDir();

	try {

		const streams: IStream[] = [];
		for (const file of files) {
			let actualFile = file;
			if (file.endsWith('.srt')) {
				const srtData = fs.readFileSync(file);
				actualFile = await new Promise((resolve, reject) => {
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

			const streamsFromFile = await detectStreams(args.packager, actualFile);
			streams.push(...streamsFromFile);
		}

		console.log(`Detected ${streams.length} streams, from ${files.length} files!`);

		const movieData = files.map(file => Regexes.VideoFile('mp4').exec(path.basename(file))).find(r => r != null);

		const title = await input({ message: 'Movie title?', default: movieData != null ? movieData[1] : undefined, required: true });
		const year = await input({ message: 'Year?', default: movieData != null ? movieData[2] : undefined, required: true });

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

		console.log('Packaging...');
		const fileTitle = `${title} (${year})`;
		await packageStreams(args.packager, fileTitle, streams, outDir);
		console.log('Streams packaged!');

		const node = create({ url: args.ipfs });
		for await (const file of node.addAll(globSource(outDir.getPath(), '**'), {
			pin: false,
			wrapWithDirectory: true
		})) {
			if (file.path === '') {
				console.log(`Added to ipfs ${chalk.green(file.cid)}`);
				console.log(`Item ${chalk.blue(fileTitle)}`);
			}
		}

		console.log('Done!');
	} finally {
		outDir.clean();
		temp.clean();
	}
})();

