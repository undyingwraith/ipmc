import { inject, injectable } from 'inversify';
import { IFileInfo, IIpfsService, IIpfsServiceSymbol, ILibrary, ILogService, ILogServiceSymbol, IMusicMetaData } from 'ipmc-interfaces';
import NodeID3 from 'node-id3';
import { Regexes } from '../../Regexes';
import { IFetchOptions } from './IFetchOptions';
import { IIndexFetcher } from './IIndexFetcher';
import { ScriptElementKindModifier } from 'typescript';

@injectable()
export class MusicIndexFetcher implements IIndexFetcher<IMusicMetaData[]> {
	constructor(
		@inject(IIpfsServiceSymbol) private readonly node: IIpfsService,
		@inject(ILogServiceSymbol) private readonly log: ILogService,
	) { }

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
		const { libraryId, cid, abortSignal, old, onProgress } = options;
		const files = (await this.node.ls(cid, abortSignal)).filter(f => f.type == 'dir');
		abortSignal.throwIfAborted();
		const index = [];
		for (const [i, file] of files.entries()) {
			try {
				index.push(...(await this.extractMusicMetaData(file, libraryId, abortSignal)));
			} catch (ex: any) {
				this.log.error(ex);
			}
			onProgress(i + 1, files.length);
		}

		return index;
	}

	public async extractMusicMetaData(entry: IFileInfo, parentId: string, signal: AbortSignal): Promise<IMusicMetaData[]> {
		const entries = await this.node.ls(entry.cid, signal);
		const files = entries.filter(f => f.type == 'file');
		const musicFile = files.find(f => f.name.endsWith('.mp3'));

		if (!musicFile) {
			const directoryFile = entries.filter(f => f.type == 'dir');
			if (directoryFile) {
				return (await Promise.all(directoryFile.map(file => this.extractMusicMetaData(file, `${parentId}/${file.name}`, signal)))).flat(1);
			} else {
				throw new Error('Failed to find music or directory file in ' + entry.name + '|' + entry.cid);
			}

		}


		const track = Buffer.from(await this.node.fetch(musicFile?.cid));
		const tags = NodeID3.read(track);


		const result: IMusicMetaData = {
			...entry,
			title: tags.title ?? "No Title",
			pinId: `${parentId}/${entry.name}`,
			music: musicFile,
			thumbnails: files.filter(f => Regexes.Thumbnail.exec(f.name) != null),
			lyrics: tags.unsynchronisedLyrics?.text,
			year: tags.originalYear != undefined ? parseInt(tags.originalYear) : 0,
		};

		return [result];
	}


}
