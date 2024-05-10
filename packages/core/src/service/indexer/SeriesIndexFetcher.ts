import { IIpfsService } from "../IIpfsService";
import { IEpisodeMetaData, IGenericLibrary, ISeasonMetaData, ISeriesMetaData } from "../Library";
import { IFileInfo } from "./IFileInfo";
import { IIndexFetcher } from './IIndexFetcher';
import { Regexes } from "./Regexes";

export class SeriesIndexFetcher implements IIndexFetcher<ISeriesMetaData[]> {
	constructor(private readonly node: IIpfsService, private readonly lib: IGenericLibrary<ISeriesMetaData, 'series'>) {
	}

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

		return {
			title: entry.name,
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
			seasons: await Promise.all(folders.map(season => this.extractSeasonMetaData(node, season))),
		};
	}

	public async extractSeasonMetaData(node: IIpfsService, entry: IFileInfo, skeleton?: any): Promise<ISeasonMetaData> {
		const entries = await this.node.ls(entry.cid);
		const files = entries.filter(f => f.type == 'file');
		const folders = entries.filter(f => f.type !== 'file');

		return {
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
			episodes: await Promise.all(folders.map(episode => this.extractEpisodeMetaData(node, episode))),
		};
	}
	public async extractEpisodeMetaData(node: IIpfsService, entry: IFileInfo, skeleton?: any): Promise<IEpisodeMetaData> {
		const files = (await this.node.ls(entry.cid)).filter(f => f.type == 'file');

		return {
			title: entry.name,
			file: files.filter(f => f.name.endsWith('.mp4'))[0],
			thumbnails: files.filter(f => Regexes.Thumbnail.exec(f.name) != null),
		};
	}
}
