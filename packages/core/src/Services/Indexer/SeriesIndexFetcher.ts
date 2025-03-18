import { IEpisodeMetaData, IFileInfo, IIpfsService, ILibrary, ISeasonMetaData, ISeriesMetaData } from 'ipmc-interfaces';
import { Regexes } from '../../Regexes';
import { IFetchOptions, IIndexFetcher } from './IIndexFetcher';
import { VideoIndexFetcher } from './VideoIndexFetcher';

export class SeriesIndexFetcher implements IIndexFetcher<ISeriesMetaData[]> {
	constructor(private readonly node: IIpfsService) {
		this.videoIndexer = new VideoIndexFetcher(node);
	}

	public get version() {
		return `0_${this.videoIndexer.version}`;
	}

	public async fetchIndex(options: IFetchOptions<ISeriesMetaData[]>): Promise<ISeriesMetaData[]> {
		const { libraryId, cid, abortSignal } = options;
		const files = (await this.node.ls(cid)).filter(f => f.type == 'dir');
		const index = [];
		for (const file of files) {
			index.push(await this.extractSeriesMetaData(libraryId, file, abortSignal));
		}

		return index;
	}

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

	public canIndex(library: ILibrary): boolean {
		return library.type === 'series';
	}

	private videoIndexer: VideoIndexFetcher;
}
