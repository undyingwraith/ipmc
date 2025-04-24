import { IFetchOptions } from './IFetchOptions';
import { IIndexFetcher } from './IIndexFetcher';
import { HasPinAbility, IFileInfo, IIpfsService, ILibrary, ILogService, IMusicMetaData, IMusicFile } from 'ipmc-interfaces';
import { Regexes } from '../../Regexes';
import NodeID3 from 'node-id3';
export class MusicIndexFetcher implements IIndexFetcher<IMusicMetaData[]> {
	constructor(private readonly node: IIpfsService, private readonly log: ILogService) { }

	/**
	 * @inheritdoc
	 */
	get version(): string {
		return '0';
	}

	/**
	 * @inheritdoc
	 */
	public canIndex(library: ILibrary): boolean {
		return library.type === 'music';
	}

	/**
	 * @inheritdoc
	 */
	public async fetchIndex(options: IFetchOptions<IMusicMetaData[]>): Promise<IMusicMetaData[]> {
		const { libraryId, cid, abortSignal, old } = options;
		const files = (await this.node.ls(cid, abortSignal)).filter(f => f.type == 'dir');
		abortSignal.throwIfAborted();
		const index = [];
		for (const [i, file] of files.entries()) {
			try {
				index.push(old?.find(f => f.cid === file.cid) ?? await this.extractMusicMetaData(file, libraryId, abortSignal));
			} catch (ex: any) {
				this.log.error(ex);
			}
		}

		return index;
	}

	public async extractMusicMetaData(entry: IFileInfo, parentId: string, signal: AbortSignal): Promise<IMusicMetaData> {
		const entries = await this.node.ls(entry.cid, signal);
		const files = entries.filter(f => f.type == 'file');
		const musicFile = files.find(f => f.name.endsWith('.mp3'));
		const tags = NodeID3.read(musicFile);

		if (!musicFile) throw new Error('Failed to find music file in ' + entry.name + '|' + entry.cid);



		const result: IMusicMetaData = {
			...entry,
			title: tags.title ?? "No Title",
			pinId: `${parentId}/${entry.name}`,
			music: musicFile,
			thumbnails: files.filter(f => Regexes.Thumbnail.exec(f.name) != null),
			lyrics: tags.unsynchronisedLyrics?.text,
			year: tags.originalYear != undefined ? parseInt(tags.originalYear) : 0,
		};

		return result;
	}


}
