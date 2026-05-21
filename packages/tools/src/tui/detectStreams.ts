import { IStream } from './IStream';
import { promiseExec } from './utils';

export async function detectStreams(file: string): Promise<IStream[]> {
	const streams: IStream[] = [];
	if (file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.mkv')) {
		const data = JSON.parse(await promiseExec(`ffprobe -output_format json -show_streams "${file}"`));
		for (const s of data.streams) {
			streams.push({
				file,
				id: s.index,
				type: s.codec_type,
				lang: s.tags.language,
			});
		}
	}

	if (file.endsWith('.webvtt') || file.endsWith('.vtt') || file.endsWith('.srt')) {
		streams.push({
			file,
			id: streams.length,
			type: 'subtitle',
			lang: 'unk',
			role: 'subtitle',
		});
	}

	return streams;
}
