import { inject, injectable } from 'inversify';
import { IAlbumMetadata, IAudioMetaData as IAudioMetadata, IFileInfo, IIpfsService, IIpfsServiceSymbol, ILibrary, ILogService, ILogServiceSymbol } from 'ipmc-interfaces';
import NodeID3 from 'node-id3';
import { Regexes } from '../../Regexes';
import { IFetchOptions } from './IFetchOptions';
import { IIndexFetcher } from './IIndexFetcher';

@injectable()
export class AudioIndexFetcher implements IIndexFetcher<IAlbumMetadata[]> {
	constructor(
		@inject(IIpfsServiceSymbol) private readonly node: IIpfsService,
		@inject(ILogServiceSymbol) private readonly log: ILogService,
	) { }

	/**
	 * @inheritdoc
	 */
	get version(): string {
		return '3.000000001';
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
	public async fetchIndex(options: IFetchOptions<IAlbumMetadata[]>): Promise<IAlbumMetadata[]> {
		const { libraryId, cid, abortSignal, old, onProgress } = options;
		const files = (await this.node.ls(cid, abortSignal)).filter(f => f.type == 'dir');
		abortSignal.throwIfAborted();

		const index = [];
		for (const [i, file] of files.entries()) {
			try {
				index.push(await this.extractAlbumMetadata(
					file,
					libraryId,
					old,
					abortSignal));
			} catch (ex: any) {
				this.log.error(ex);
			}
			onProgress(i + 1, files.length);
		}

		return index.flat();
	}

	public async extractAlbumMetadata(entry: IFileInfo, parentId: string, old: IAlbumMetadata[] | undefined, signal: AbortSignal): Promise<IAlbumMetadata[]> {
		const entries = await this.node.ls(entry.cid, signal);
		const files = entries.filter(f => f.type == 'file');
		const musicFiles = files.filter(f => f.name.endsWith('.mp3'));
		const albumCover = files.filter(f => Regexes.Poster.exec(f.name) != null);
		const album: Omit<IAlbumMetadata, 'artist' | 'items'> = {
			...entry,
			pinId: `${parentId}/${entry.name}`,
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
		};

		// Check for directories if no music files were found
		if (musicFiles.length <= 0) {
			const directories = entries.filter(f => f.type == 'dir');
			if (directories.length >= 0) {
				return (await Promise.all(directories.map(file => this.extractAlbumMetadata(file, `${parentId}/${file.name}`, old, signal)))).flat(1);
			} else {
				throw new Error('Failed to find music files or directories in ' + entry.name + '|' + entry.cid);
			}
		}


		// Fetch data for music files
		const songs: IAudioMetadata[] = [];
		const artistList = [];
		for (const song of musicFiles) {
			// Only recheck new files
			const existing = old?.find(o => o.cid === album.cid)?.items.find(o => o.cid === song.cid);
			if (existing) {
				songs.push(existing);
			} else {
				const { iaudiometadata, albumartist } = await this.extractAudioMetadata(song, album, albumCover);
				artistList.push(albumartist);
				songs.push(iaudiometadata);
			}
		}


		return [{
			...album,
			artist: artistList.find(el => el !== undefined)
				?? songs.find(s => s.artist !== undefined)?.artist
				?? this.unknownArtist,
			items: songs
		}];
	}

	public async extractAudioMetadata(song: IFileInfo, album: Omit<IAlbumMetadata, 'artist' | 'items'>, albumCover: IFileInfo[]): Promise<{ iaudiometadata: IAudioMetadata, albumartist: string | undefined; }> {
		// Fetch length of ID3 tags in bytes
		const tagLength = (await this.node.fetch(song.cid, { offset: 6, length: 4 })).reduce((prev, current) => prev * 128 + current);
		// Only fetch header + tags
		const track = Buffer.from(await this.node.fetch(song.cid, { length: tagLength + 10 }));
		const tags = NodeID3.read(track);

		return {
			iaudiometadata: {
				...song,
				title: tags.title ?? "No Title",
				pinId: `${album.pinId}/${song.name}`,
				// TODO: maybe write own regex, maybe not?
				cover: albumCover,
				lyrics: tags.unsynchronisedLyrics?.text,
				year: tags.year != undefined ? parseInt(tags.year) : 0,
				artist: tags.artist ?? this.unknownArtist,
				album: tags.album ?? "No Album",
				genre: tags.genre ?? "Unknown",
			},
			albumartist: tags.performerInfo,
		};
	}

	/**
	 * Text used for unknown artists.
	 */
	private readonly unknownArtist = 'Unknown Artist';
}
