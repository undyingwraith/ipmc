import { inject, injectable } from 'inversify';
import { IEpisodeMetadata, IFileInfo, IIpfsService, IIpfsServiceSymbol, ILibrary, ILogService, ILogServiceSymbol, IOnProgress, ISeasonMetadata, ISeriesMetadata } from 'ipmc-interfaces';
import { Regexes } from '../../Regexes';
import { IFetchOptions } from './IFetchOptions';
import { IIndexFetcher } from './IIndexFetcher';
import { VideoIndexFetcher } from './VideoIndexFetcher';

interface IBaseOptions {
	/**
	 * Entry the entry to fetch data from.
	 */
	entry: IFileInfo;

	/**
	 * Function to report progress.
	 */
	onProgress: IOnProgress;

	/**
	 * {@link AbortSignal} to cancel the process.
	 */
	signal: AbortSignal;
}

interface ISeriesOptions extends IBaseOptions {
	/**
	 * libraryId id of the {@link ILibrary}.
	 */
	libraryId: string,

	/**
	 * {@link ISeriesMetadata} of the last run, used to skip unchanged data.
	 */
	old?: ISeriesMetadata,
}

interface ISeasonOptions extends IBaseOptions {
	/**
	 * The parent {@link ISeriesMetadata}.
	 */
	parent: Omit<ISeriesMetadata, 'items'>,

	/**
	 * {@link ISeasonMetadata} of the last run, used to skip unchanged data.
	 */
	old?: ISeasonMetadata,
}

/**
 * Fetches a index for an {@link ILibrary} of type series.
 */
@injectable()
export class SeriesIndexFetcher implements IIndexFetcher<ISeriesMetadata[]> {
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
		return `4_${this.videoIndexer.version}`;
	}

	/**
	 * @inheritdoc
	 */
	public canIndex(library: ILibrary): boolean {
		return library.type === 'series';
	}

	/**
	 * @inheritdoc
	 */
	public async fetchIndex(options: IFetchOptions<ISeriesMetadata[]>): Promise<ISeriesMetadata[]> {
		const { libraryId, cid, abortSignal, onProgress, old } = options;
		const folders = (await this.node.ls(cid)).filter(f => f.type == 'dir');

		const index = [];
		for (const [i, file] of folders.entries()) {
			index.push(old?.find(f => f.cid === file.cid) ?? await this.extractSeriesMetaData({
				libraryId,
				entry: file,
				onProgress: this.createSubProgress(onProgress, i, folders.length),
				signal: abortSignal,
				old: old?.find(f => f.name === file.name)
			}));
			onProgress(i + 1, folders.length);
		}

		return index;
	}

	/**
	 * Extracts metadata for a single {@link ISeriesMetadata}.
	 * @param options the options that configure how metadata is extracted.
	 * @returns the extracted {@link ISeriesMetadata}.
	 */
	public async extractSeriesMetaData(options: ISeriesOptions): Promise<ISeriesMetadata> {
		const { entry, libraryId, onProgress, signal, old } = options;
		const entries = await this.node.ls(entry.cid);
		const files = entries.filter(f => f.type == 'file');
		const folders = entries.filter(f => f.type !== 'file');

		const serie: Omit<ISeriesMetadata, 'items'> = {
			...entry,
			pinId: `${libraryId}/${entry.name}`,
			title: entry.name,
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
			backdrops: files.filter(f => Regexes.Backdrop.exec(f.name) != null),
		};

		const items = [];
		for (const [i, file] of folders.entries()) {
			try {
				items.push(old?.items.find(f => f.cid === file.cid) ?? await this.extractSeasonMetaData({
					entry: file,
					parent: serie,
					onProgress: this.createSubProgress(onProgress, i, folders.length),
					old: old?.items.find(f => f.name === file.name),
					signal
				}));
				onProgress(i + 1, folders.length);
			} catch (ex: any) {
				this.log.error(ex);
			}
		}

		return {
			...serie,
			items,
		};
	}

	/**
	 * Extracts the metadata for a single {@link ISeasonMetadata}.
	 * @param options the options that configure how metadata is extracted.
	 * @returns the extracted {@link ISeasonMetadata}.
	 */
	public async extractSeasonMetaData(options: ISeasonOptions): Promise<ISeasonMetadata> {
		const { entry, onProgress, parent, signal, old } = options;
		const entries = await this.node.ls(entry.cid);
		const files = entries.filter(f => f.type == 'file');
		const folders = entries.filter(f => f.type !== 'file');
		const seasonData = Regexes.SeasonFolder.exec(entry.name);

		const season: Omit<ISeasonMetadata, 'items'> = {
			...entry,
			pinId: `${parent.pinId}/${entry.name}`,
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
			backdrops: files.filter(f => Regexes.Backdrop.exec(f.name) != null),
			series: parent.title,
			season: (seasonData ? seasonData[2] : null) ?? '?',
		};

		if (season.posters.length == 0) {
			season.posters = parent.posters;
		}
		if (season.backdrops.length == 0) {
			season.backdrops = parent.backdrops;
		}

		const items = [];
		for (const [i, file] of folders.entries()) {
			try {
				items.push(old?.items.find(f => f.cid === file.cid) ?? await this.extractEpisodeMetaData(file, season, signal));
				onProgress(i + 1, folders.length);
			} catch (ex: any) {
				this.log.error(ex);
			}
		}

		return {
			...season,
			items,
		};
	}

	/**
	 * Extracts the metadata for a single {@link IEpisodeMetadata}.
	 * @param entry the entry to fetch data from.
	 * @param parent the parent {@link ISeasonMetadata}.
	 * @param signal {@link AbortSignal}.
	 * @returns the extracted {@link IEpisodeMetadata}.
	 */
	public async extractEpisodeMetaData(entry: IFileInfo, parent: Omit<ISeasonMetadata, 'items'>, signal: AbortSignal): Promise<IEpisodeMetadata> {
		return this.videoIndexer.fetch<IEpisodeMetadata>(parent.pinId, entry, signal, (files, video) => {
			const episodeData = Regexes.EpisodeFile('mpd').exec(video.video.name);
			let posters = files.filter(f => Regexes.Poster.exec(f.name) != null);
			let backdrops = files.filter(f => Regexes.Backdrop.exec(f.name) != null);

			if (posters.length == 0) {
				posters = parent.posters;
			}
			if (backdrops.length == 0) {
				backdrops = parent.backdrops;
			}
			return {
				...video,
				series: (episodeData ? episodeData[1] : null) ?? '?',
				season: (episodeData ? episodeData[2] : null) ?? '?',
				episode: (episodeData ? episodeData[3] : null) ?? '?',
				posters,
				backdrops,
				title: episodeData && episodeData[4] ? episodeData[4] : video.name,
			};
		});
	}

	public createSubProgress(onProgress: IOnProgress, progress: number, total: number): IOnProgress {
		return (subProgress, subTotal) => {
			onProgress(progress + (subProgress / (subTotal ?? 100)), total);
		};
	}

	private videoIndexer: VideoIndexFetcher;
}
