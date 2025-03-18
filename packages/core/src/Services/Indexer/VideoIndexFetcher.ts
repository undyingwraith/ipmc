import { HasPinAbility, IFileInfo, IIpfsService, IVideoFile } from 'ipmc-interfaces';
import { Regexes } from '../../Regexes';
import { ISubtitleMetadata } from 'ipmc-interfaces';

export class VideoIndexFetcher {
	constructor(private readonly node: IIpfsService) { }

	async fetch<T extends (IVideoFile & HasPinAbility)>(parentId: string, entry: IFileInfo, signal: AbortSignal, finalize: (files: IFileInfo[], video: (IVideoFile & HasPinAbility)) => T): Promise<T> {
		const entries = await this.node.ls(entry.cid, signal);
		const files = entries.filter(f => f.type == 'file');
		const videoFile = files.find(f => f.name.endsWith('.mpd'));

		if (!videoFile) throw new Error('Failed to find video file in ' + entry.name + '|' + entry.cid);

		const subtitles: ISubtitleMetadata[] = [];
		const languages: string[] = [];
		const metadata = new DOMParser().parseFromString(new TextDecoder().decode(await this.node.fetch(videoFile.cid)), 'text/xml');
		const tracks = metadata.getElementsByTagName("AdaptationSet");
		for (const track of Array.from(tracks)) {
			if (track.getAttribute('contentType') === 'audio') {
				languages.push(track.getAttribute('lang') ?? 'none');
			}
			if (track.getAttribute('contentType') === 'text') {
				subtitles.push({
					language: track.getAttribute('lang') ?? 'none',
					forced: track.getElementsByTagName('Role')[0].getAttribute('value') === 'forced-subtitle',
				});
			}
		}

		const result: (IVideoFile & HasPinAbility) = {
			...entry,
			pinId: `${parentId}/${entry.name}`,
			video: videoFile,
			thumbnails: files.filter(f => Regexes.Thumbnail.exec(f.name) != null),
			languages,
			subtitles,
		};

		return finalize(files, result);
	}

	public version = '0';
}
