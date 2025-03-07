import { exec } from 'child_process';
import { IStream, TStream } from './IStream';

export async function detectStreams(packager: string, file: string): Promise<IStream[]> {
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
