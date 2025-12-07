import { inject, injectable } from 'inversify';
import { IFileInfo, IIpfsService, IIpfsServiceSymbol, ILibrary, ILogService, ILogServiceSymbol, IMovieMetaData } from 'ipmc-interfaces';
import { Regexes } from '../../Regexes';
import { IFetchOptions } from './IFetchOptions';
import { IIndexFetcher } from './IIndexFetcher';
import { VideoIndexFetcher } from './VideoIndexFetcher';

/**
 * Fetches a index for an {@link ILibrary} of type movie.
 */
@injectable()
export class MovieIndexFetcher implements IIndexFetcher<IMovieMetaData[]> {
	constructor(
		@inject(IIpfsServiceSymbol) private readonly node: IIpfsService,
		@inject(ILogServiceSymbol) private readonly log: ILogService,
	) {
		this.videoIndexer = new VideoIndexFetcher(node);
	}

	/**
	 * @inheritdoc
	 */
	public get version() {
		return `3_${this.videoIndexer.version}`;
	}

	/**
	 * @inheritdoc
	 */
	public get name() {
		return 'MovieIndexer';
	}

	/**
	 * @inheritdoc
	 */
	public canIndex(library: ILibrary): boolean {
		return library.type === 'movie';
	}


	/**
	 * @inheritdoc
	 */
	public async fetchIndex(options: IFetchOptions<IMovieMetaData[]>): Promise<IMovieMetaData[]> {
		const { cid, abortSignal, old, onProgress, libraryId, } = options;
		const files = (await this.node.ls(cid, abortSignal)).filter(f => f.type == 'dir');
		abortSignal.throwIfAborted();
		const index = [];
		onProgress(0, files.length);
		for (const [i, file] of files.entries()) {
			try {
				index.push(old?.find(f => f.cid === file.cid) ?? await this.extractMovieMetaData(libraryId, file, abortSignal));
			} catch (ex: any) {
				this.log.error(ex);
			}
			abortSignal.throwIfAborted();
			onProgress(i + 1, files.length);
		}

		return index;
	}

	/**
	 * Extracts the metadat of a single {@link IMovieMetaData}.
	 * @param libraryId id of the {@link ILibrary}.
	 * @param entry the entry to fetch data from.
	 * @param signal {@link AbortSignal}.
	 * @returns the extracted {@link IMovieMetaData}.
	 */
	public async extractMovieMetaData(libraryId: string, entry: IFileInfo, signal: AbortSignal): Promise<IMovieMetaData> {
		return this.videoIndexer.fetch<IMovieMetaData>(libraryId, entry, signal, (files, video) => {
			const videoData = Regexes.VideoFile('mpd').exec(video.video.name);

			return {
				...video,
				title: videoData != null ? videoData[1] : video.name,
				year: videoData != null && videoData[2] != null ? parseInt(videoData[2]) : 0,
				posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
				backdrops: files.filter(f => Regexes.Backdrop.exec(f.name) != null),
			};
		});
	}

	private videoIndexer: VideoIndexFetcher;
}
