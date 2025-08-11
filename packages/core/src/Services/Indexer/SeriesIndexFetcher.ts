import { inject, injectable } from 'inversify';
import { IEpisodeMetadata, IFileInfo, IIpfsService, IIpfsServiceSymbol, ILibrary, ILogService, ILogServiceSymbol, IOnProgress, ISeasonMetadata, ISeriesMetadata } from 'ipmc-interfaces';
import { Regexes } from '../../Regexes';
import { IFetchOptions } from './IFetchOptions';
import { IIndexFetcher } from './IIndexFetcher';
import { VideoIndexFetcher } from './VideoIndexFetcher';

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
		return `3_${this.videoIndexer.version}`;
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
		const { libraryId, cid, abortSignal, onProgress } = options;
		const folders = (await this.node.ls(cid)).filter(f => f.type == 'dir');

		const index = [];
		for (const [i, file] of folders.entries()) {
			index.push(await this.extractSeriesMetaData(libraryId, file, this.createSubProgress(onProgress, i, folders.length), abortSignal));
			onProgress(i + 1, folders.length);
		}

		return index;
	}

	/**
	 * Extracts metadata for a single {@link ISeriesMetadata}.
	 * @param libraryId id of the {@link ILibrary}.
	 * @param entry the entry to fetch data from.
	 * @param signal {@link AbortSignal}.
	 * @returns the extracted {@link ISeriesMetadata}.
	 */
	public async extractSeriesMetaData(libraryId: string, entry: IFileInfo, onProgress: IOnProgress, signal: AbortSignal): Promise<ISeriesMetadata> {
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
				items.push(await this.extractSeasonMetaData(file, serie, this.createSubProgress(onProgress, i, folders.length), signal));
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
	 * @param entry the entry to fetch data from.
	 * @param parent the parent {@link ISeriesMetadata}.
	 * @param signal {@link AbortSignal}.
	 * @returns the extracted {@link ISeasonMetadata}.
	 */
	public async extractSeasonMetaData(entry: IFileInfo, parent: Omit<ISeriesMetadata, 'items'>, onProgress: IOnProgress, signal: AbortSignal): Promise<ISeasonMetadata> {
		const entries = await this.node.ls(entry.cid);
		const files = entries.filter(f => f.type == 'file');
		const folders = entries.filter(f => f.type !== 'file');

		const season: Omit<ISeasonMetadata, 'items'> = {
			...entry,
			pinId: `${parent.pinId}/${entry.name}`,
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
			backdrops: files.filter(f => Regexes.Backdrop.exec(f.name) != null),
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
				items.push(await this.extractEpisodeMetaData(file, season, signal));
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
				series: episodeData ? episodeData[1] : undefined,
				season: episodeData ? episodeData[2] : undefined,
				episode: episodeData ? episodeData[3] : undefined,
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
