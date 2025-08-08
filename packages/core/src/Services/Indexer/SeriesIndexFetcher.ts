import { inject, injectable } from 'inversify';
import { IEpisodeMetaData, IFileInfo, IIpfsService, IIpfsServiceSymbol, ILibrary, ILogService, ILogServiceSymbol, IOnProgress, ISeasonMetaData, ISeriesMetaData } from 'ipmc-interfaces';
import { Regexes } from '../../Regexes';
import { IFetchOptions } from './IFetchOptions';
import { IIndexFetcher } from './IIndexFetcher';
import { VideoIndexFetcher } from './VideoIndexFetcher';

/**
 * Fetches a index for an {@link ILibrary} of type series.
 */
@injectable()
export class SeriesIndexFetcher implements IIndexFetcher<ISeriesMetaData[]> {
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
		return `0_${this.videoIndexer.version}`;
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
	public async fetchIndex(options: IFetchOptions<ISeriesMetaData[]>): Promise<ISeriesMetaData[]> {
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
	 * Extracts metadata for a single {@link ISeriesMetaData}.
	 * @param libraryId id of the {@link ILibrary}.
	 * @param entry the entry to fetch data from.
	 * @param signal {@link AbortSignal}.
	 * @returns the extracted {@link ISeriesMetaData}.
	 */
	public async extractSeriesMetaData(libraryId: string, entry: IFileInfo, onProgress: IOnProgress, signal: AbortSignal): Promise<ISeriesMetaData> {
		const entries = await this.node.ls(entry.cid);
		const files = entries.filter(f => f.type == 'file');
		const folders = entries.filter(f => f.type !== 'file');

		const serie: Omit<ISeriesMetaData, 'items'> = {
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
	 * Extracts the metadata for a single {@link ISeasonMetaData}.
	 * @param entry the entry to fetch data from.
	 * @param parent the parent {@link ISeriesMetaData}.
	 * @param signal {@link AbortSignal}.
	 * @returns the extracted {@link ISeasonMetaData}.
	 */
	public async extractSeasonMetaData(entry: IFileInfo, parent: Omit<ISeriesMetaData, 'items'>, onProgress: IOnProgress, signal: AbortSignal): Promise<ISeasonMetaData> {
		const entries = await this.node.ls(entry.cid);
		const files = entries.filter(f => f.type == 'file');
		const folders = entries.filter(f => f.type !== 'file');

		const season: Omit<ISeasonMetaData, 'items'> = {
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
	 * Extracts the metadata for a single {@link IEpisodeMetaData}.
	 * @param entry the entry to fetch data from.
	 * @param parent the parent {@link ISeasonMetaData}.
	 * @param signal {@link AbortSignal}.
	 * @returns the extracted {@link IEpisodeMetaData}.
	 */
	public async extractEpisodeMetaData(entry: IFileInfo, parent: Omit<ISeasonMetaData, 'items'>, signal: AbortSignal): Promise<IEpisodeMetaData> {
		return this.videoIndexer.fetch<IEpisodeMetaData>(parent.pinId, entry, signal, (files, video) => {
			let posters = files.filter(f => Regexes.Poster.exec(f.name) != null);

			if (posters.length == 0) {
				posters = parent.posters;
			}
			return {
				...video,
				posters,
				title: video.name,
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
