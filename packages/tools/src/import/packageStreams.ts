import { exec } from 'child_process';
import { ITempDir } from '../utils/tempDIr';
import { IStream } from './IStream';

export async function packageStreams(packager: string, title: string, streams: IStream[], workdir: ITempDir): Promise<void> {
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
