import { HasPinAbility, IFileInfo, IIpfsService, IVideoFile } from 'ipmc-interfaces';
import { parse as parseDuration } from 'tinyduration';
import { Regexes } from '../../Regexes';

/**
 * A generic index fetcher to fetch {@link IVideoFile} metadata.
 */
export class VideoIndexFetcher {
	constructor(private readonly node: IIpfsService) { }

	/**
	 * Fetches the metadata of a {@link IVideoFile}.
	 * @param parentId id of the parent item.
	 * @param entry the item to fetch the metadata of.
	 * @param signal {@link AbortSignal}.
	 * @param finalize function to add additional metadata.
	 */
	async fetch<T extends (IVideoFile & HasPinAbility)>(parentId: string, entry: IFileInfo, signal: AbortSignal, finalize: (files: IFileInfo[], video: (IVideoFile & HasPinAbility)) => T): Promise<T> {
		const entries = await this.node.ls(entry.cid, signal);
		const files = entries.filter(f => f.type == 'file');
		const videoFile = files.find(f => f.name.endsWith('.mpd'));

		if (!videoFile) throw new Error('Failed to find video file in ' + entry.name + '|' + entry.cid);

		const result: (IVideoFile & HasPinAbility) = {
			...entry,
			pinId: `${parentId}/${entry.name}`,
			video: videoFile,
			thumbnails: files.filter(f => Regexes.Thumbnail.exec(f.name) != null),
			resolution: 0,
			duration: 0,
			languages: [],
			subtitles: [],
		};

		const metadata = new DOMParser().parseFromString(new TextDecoder().decode(await this.node.fetch(videoFile.cid)), 'text/xml');
		const tracks = metadata.getElementsByTagName("AdaptationSet");
		for (const track of Array.from(tracks)) {
			switch (track.getAttribute('contentType')) {
				case 'audio':
					result.languages.push(track.getAttribute('lang') ?? 'none');
					break;
				case 'text':
					const role = track.getElementsByTagName('Role')[0]?.getAttribute('value') ?? 'subtitle';
					result.subtitles.push({
						language: track.getAttribute('lang') ?? 'none',
						forced: role === 'forced-subtitle',
						role,
					});
					break;
				case 'video':
					const resolution = track.getAttribute('maxHeight') ?? track.getAttribute('height');
					result.resolution = resolution != null ? parseInt(resolution) : 0;
					break;
			}
		}


		const duration = metadata.getElementsByTagName('MPD')[0].getAttribute('mediaPresentationDuration');
		if (duration) {
			const parsed = parseDuration(duration);
			result.duration = ((parsed.hours ?? 0) * 60 + (parsed.minutes ?? 0)) * 60 + (parsed.seconds ?? 0);
		}

		return finalize(files, result);
	}

	/**
	 * The current version of the {@link VideoIndexFetcher}.
	 */
	public version = '2';
}
