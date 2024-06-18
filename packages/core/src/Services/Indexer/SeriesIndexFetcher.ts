import { IIpfsService, IEpisodeMetaData, IGenericLibrary, ISeasonMetaData, ISeriesMetaData, IFileInfo } from 'ipmc-interfaces';
import { IIndexFetcher } from './IIndexFetcher';
import { Regexes } from '../../Regexes';

export class SeriesIndexFetcher implements IIndexFetcher<ISeriesMetaData[]> {
	constructor(private readonly node: IIpfsService, private readonly lib: IGenericLibrary<ISeriesMetaData, 'series'>) {
	}

	public version = '0';

	public async fetchIndex(): Promise<ISeriesMetaData[]> {
		const files = (await this.node.ls(this.lib.root.toString())).filter(f => f.type == 'dir');
		const index = [];
		for (const file of files) {
			index.push(await this.extractSeriesMetaData(this.node, file));
		}

		return index;
	}

	public async extractSeriesMetaData(node: IIpfsService, entry: IFileInfo): Promise<ISeriesMetaData> {
		const entries = await this.node.ls(entry.cid);
		const files = entries.filter(f => f.type == 'file');
		const folders = entries.filter(f => f.type !== 'file');

		const serie: Omit<ISeriesMetaData, 'items'> = {
			...entry,
			title: entry.name,
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
		};

		return {
			...serie,
			items: await Promise.all(folders.map(season => this.extractSeasonMetaData(node, season, serie))),
		};
	}

	public async extractSeasonMetaData(node: IIpfsService, entry: IFileInfo, parent: Omit<ISeriesMetaData, 'items'>): Promise<ISeasonMetaData> {
		const entries = await this.node.ls(entry.cid);
		const files = entries.filter(f => f.type == 'file');
		const folders = entries.filter(f => f.type !== 'file');

		const season: Omit<ISeasonMetaData, 'items'> = {
			...entry,
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
		};

		if (season.posters.length == 0) {
			season.posters = parent.posters;
		}

		return {
			...season,
			items: await Promise.all(folders.map(episode => this.extractEpisodeMetaData(node, episode, season))),
		};
	}

	public async extractEpisodeMetaData(node: IIpfsService, entry: IFileInfo, parent: Omit<ISeasonMetaData, 'items'>): Promise<IEpisodeMetaData> {
		const files = (await this.node.ls(entry.cid)).filter(f => f.type == 'file');

		const episode = {
			...entry,
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
			title: entry.name,
			video: files.filter(f => f.name.endsWith('.mp4'))[0],
			thumbnails: files.filter(f => Regexes.Thumbnail.exec(f.name) != null),
		};

		if (episode.posters.length == 0) {
			episode.posters = parent.posters;
		}

		return episode;
	}
}
