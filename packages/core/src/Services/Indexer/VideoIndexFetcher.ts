import { HasPinAbility, IFileInfo, IIpfsService, IVideoFile } from 'ipmc-interfaces';
import { Regexes } from '../../Regexes';
import { ISubtitleMetadata } from 'ipmc-interfaces';

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
					role: track.getElementsByTagName('Role')[0].getAttribute('value')!,
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

	/**
	 * The current version of the {@link VideoIndexFetcher}.
	 */
	public version = '1';
}
