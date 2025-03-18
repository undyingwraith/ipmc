import { IFileInfo, IIpfsService, ILibrary, ILogService, IMovieMetaData, IOnProgress } from 'ipmc-interfaces';
import { Regexes } from '../../Regexes';
import { IFetchOptions, IIndexFetcher } from './IIndexFetcher';
import { VideoIndexFetcher } from './VideoIndexFetcher';

export class MovieIndexFetcher implements IIndexFetcher<IMovieMetaData[]> {
	constructor(private readonly node: IIpfsService, private readonly log: ILogService) {
		this.videoIndexer = new VideoIndexFetcher(node);
	}

	public get version() {
		return `0_${this.videoIndexer.version}`;
	}

	/**
	 * @inheritdoc
	 */
	public async fetchIndex(options: IFetchOptions<IMovieMetaData[]>): Promise<IMovieMetaData[]> {
		const { cid, abortSignal, old, onProgress, libraryId, } = options;
		const files = (await this.node.ls(cid, abortSignal)).filter(f => f.type == 'dir');
		abortSignal.throwIfAborted();
		const index = [];
		for (const [i, file] of files.entries()) {
			try {
				index.push(old?.find(f => f.cid === file.cid) ?? await this.extractMovieMetaData(libraryId, file, abortSignal));
			} catch (ex: any) {
				this.log.error(ex);
			}
			abortSignal.throwIfAborted();
			onProgress(i, files.length);
		}

		return index;
	}

	public async extractMovieMetaData(libraryId: string, entry: IFileInfo, signal: AbortSignal): Promise<IMovieMetaData> {
		return this.videoIndexer.fetch<IMovieMetaData>(libraryId, entry, signal, (files, video) => {
			const videoData = Regexes.VideoFile('mpd').exec(video.video.name)!;

			return {
				...video,
				title: videoData[1],
				year: videoData[2] != null ? parseInt(videoData[2]) : 0,
				posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
			};
		});
	}

	public canIndex(library: ILibrary): boolean {
		return library.type === 'movie';
	}

	private videoIndexer: VideoIndexFetcher;
}
