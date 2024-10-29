import { create, globSource } from 'kubo-rpc-client';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { exec } from 'child_process';
import { input } from '@inquirer/prompts';
import { ITempDir, tempDir } from './utils/tempDIr';
import chalk from 'chalk';

type TStream = 'Video' | 'Audio';

interface IStream {
	type: TStream;
	id: number;
	lang?: string;
	file: string;
}

async function detectStreams(packager: string, file: string): Promise<IStream[]> {
	return new Promise((resolve, reject) => {
		exec(`${packager} input="${file}" --dump_stream_info`, (error, stdout, stderr) => {
			if (error) {
				console.error(stderr);
				reject(error);
			} else {
				console.log(stdout);
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
	.option('file', {
		alias: 'f',
	})
	.option('title', {
		alias: 't',
	})
	.demandOption(['file', 'title'])
	.help()
	.parseSync();

(async () => {
	const streams = await detectStreams(args.packager, args.file as string);
	console.log('Streams detected!');

	for (const stream of streams) {
		if (stream.type !== 'Video') {
			stream.lang = await input({ message: `[${stream.id}|${stream.file}] Language?`, default: stream.lang });
		}
	}

	const dir = tempDir();

	await packageStreams(args.packager, args.title as string, streams, dir);
	console.log('Streams packaged!');


	const node = create({ url: args.ipfs });
	for await (const file of node.addAll(globSource(dir.getPath(), '**'), {
		pin: false,
		wrapWithDirectory: true
	})) {
		if (file.path === '') {
			console.log(`Added to ipfs ${chalk.green(file.cid)}`);
		}
	}

	dir.clean();

	console.log('done');
})();

