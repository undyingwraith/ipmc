import { IEpisodeMetaData, IFileInfo, IIpfsService, ILibrary, ISeasonMetaData, ISeriesMetaData } from 'ipmc-interfaces';
import { Regexes } from '../../Regexes';
import { IIndexFetcher } from './IIndexFetcher';
import { VideoIndexFetcher } from './VideoIndexFetcher';
import { IFetchOptions } from './IFetchOptions';

export class SeriesIndexFetcher implements IIndexFetcher<ISeriesMetaData[]> {
	constructor(private readonly node: IIpfsService) {
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
		const { libraryId, cid, abortSignal } = options;
		const files = (await this.node.ls(cid, abortSignal)).filter(f => f.type == 'dir');

		abortSignal.throwIfAborted();

		const index = [];
		for (const file of files) {
			//TODO: Try Catch
			index.push(await this.extractSeriesMetaData(libraryId, file, abortSignal));
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
	public async extractSeriesMetaData(libraryId: string, entry: IFileInfo, signal: AbortSignal): Promise<ISeriesMetaData> {
		const entries = await this.node.ls(entry.cid);
		const files = entries.filter(f => f.type == 'file');
		const folders = entries.filter(f => f.type !== 'file');

		const serie: Omit<ISeriesMetaData, 'items'> = {
			...entry,
			pinId: `${libraryId}/${entry.name}`,
			title: entry.name,
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
		};

		return {
			...serie,
			items: await Promise.all(folders.map(season => this.extractSeasonMetaData(season, serie, signal))),
		};
	}

	/**
	 * Extracts the metadata for a single {@link ISeasonMetaData}.
	 * @param entry the entry to fetch data from.
	 * @param parent the parent {@link ISeriesMetaData}.
	 * @param signal {@link AbortSignal}.
	 * @returns the extracted {@link ISeasonMetaData}.
	 */
	public async extractSeasonMetaData(entry: IFileInfo, parent: Omit<ISeriesMetaData, 'items'>, signal: AbortSignal): Promise<ISeasonMetaData> {
		const entries = await this.node.ls(entry.cid);
		const files = entries.filter(f => f.type == 'file');
		const folders = entries.filter(f => f.type !== 'file');

		const season: Omit<ISeasonMetaData, 'items'> = {
			...entry,
			pinId: `${parent.pinId}/${entry.name}`,
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
		};

		if (season.posters.length == 0) {
			season.posters = parent.posters;
		}

		return {
			...season,
			items: await Promise.all(folders.map(episode => this.extractEpisodeMetaData(episode, season, signal))),
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

	private videoIndexer: VideoIndexFetcher;
}
