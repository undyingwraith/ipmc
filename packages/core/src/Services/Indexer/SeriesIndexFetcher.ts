import { IEpisodeMetaData, IFileInfo, IIpfsService, ILibrary, ISeasonMetaData, ISeriesMetaData } from 'ipmc-interfaces';
import { Regexes } from '../../Regexes';
import { IIndexFetcher } from './IIndexFetcher';

export class SeriesIndexFetcher implements IIndexFetcher<ISeriesMetaData[]> {
	constructor(private readonly node: IIpfsService) {
	}

	public version = '0';

	public async fetchIndex(libraryId: string, cid: string): Promise<ISeriesMetaData[]> {
		const files = (await this.node.ls(cid)).filter(f => f.type == 'dir');
		const index = [];
		for (const file of files) {
			index.push(await this.extractSeriesMetaData(libraryId, file));
		}

		return index;
	}

	public async extractSeriesMetaData(libraryId: string, entry: IFileInfo): Promise<ISeriesMetaData> {
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
			items: await Promise.all(folders.map(season => this.extractSeasonMetaData(season, serie))),
		};
	}

	public async extractSeasonMetaData(entry: IFileInfo, parent: Omit<ISeriesMetaData, 'items'>): Promise<ISeasonMetaData> {
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
			items: await Promise.all(folders.map(episode => this.extractEpisodeMetaData(episode, season))),
		};
	}

	public async extractEpisodeMetaData(entry: IFileInfo, parent: Omit<ISeasonMetaData, 'items'>): Promise<IEpisodeMetaData> {
		const files = (await this.node.ls(entry.cid)).filter(f => f.type == 'file');

		const episode = {
			...entry,
			pinId: `${parent.pinId}/${entry.name}`,
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
			title: entry.name,
			video: files.filter(f => f.name.endsWith('.mpd'))[0],
			thumbnails: files.filter(f => Regexes.Thumbnail.exec(f.name) != null),
		};

		if (episode.posters.length == 0) {
			episode.posters = parent.posters;
		}

		return episode;
	}

	public canIndex(library: ILibrary): boolean {
		return library.type === 'series';
	}
}
