import { inject, injectable } from 'inversify';
import { IFileInfo, IIpfsService, IIpfsServiceSymbol, ILibrary, ILogService, ILogServiceSymbol, IMusicMetaData } from 'ipmc-interfaces';
import NodeID3 from 'node-id3';
import { Regexes } from '../../Regexes';
import { IFetchOptions } from './IFetchOptions';
import { IIndexFetcher } from './IIndexFetcher';

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
		return '0.1';
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
				index.push(...(await this.extractMusicMetaData(file, libraryId, old, abortSignal)));
			} catch (ex: any) {
				this.log.error(ex);
			}
			onProgress(i + 1, files.length);
		}

		return index;
	}

	public async extractMusicMetaData(entry: IFileInfo, parentId: string, old: IMusicMetaData[] | undefined, signal: AbortSignal): Promise<IMusicMetaData[]> {
		const entries = await this.node.ls(entry.cid, signal);
		const files = entries.filter(f => f.type == 'file');
		const musicFiles = files.filter(f => f.name.endsWith('.mp3'));

		// Check for directories if no music files were found
		if (musicFiles.length <= 0) {
			const directories = entries.filter(f => f.type == 'dir');
			if (directories.length >= 0) {
				return (await Promise.all(directories.map(file => this.extractMusicMetaData(file, `${parentId}/${file.name}`, old, signal)))).flat(1);
			} else {
				throw new Error('Failed to find music files or directories in ' + entry.name + '|' + entry.cid);
			}
		}


		// Fetch data for music files
		const songs: IMusicMetaData[] = [];
		for (const song of musicFiles) {
			// Only recheck new files
			const existing = old?.find(o => o.cid === song.cid);
			if (existing) {
				songs.push(existing);
			} else {
				const track = Buffer.from(await this.node.fetch(song?.cid));
				const tags = NodeID3.read(track);

				songs.push({
					...entry,
					title: tags.title ?? "No Title",
					pinId: `${parentId}/${entry.name}`,
					music: song,
					thumbnails: files.filter(f => Regexes.Thumbnail.exec(f.name) != null),
					lyrics: tags.unsynchronisedLyrics?.text,
					year: tags.originalYear != undefined ? parseInt(tags.originalYear) : 0,
				});
			}
		}

		return songs;
	}


}
