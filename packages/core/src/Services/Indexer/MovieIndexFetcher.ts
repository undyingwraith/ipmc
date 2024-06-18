import { IFileInfo, IIpfsService, IMovieMetaData } from 'ipmc-interfaces';
import { Regexes } from '../../Regexes';
import { IIndexFetcher } from './IIndexFetcher';

export class MovieIndexFetcher implements IIndexFetcher<IMovieMetaData[]> {
	constructor(private readonly node: IIpfsService) {
	}

	public version = '0';

	public async fetchIndex(cid: string): Promise<IMovieMetaData[]> {
		const files = (await this.node.ls(cid)).filter(f => f.type == 'dir');
		const index = [];
		for (const file of files) {
			index.push(await this.extractMovieMetaData(this.node, file));
		}

		return index;
	}

	public async extractMovieMetaData(node: IIpfsService, entry: IFileInfo, skeleton?: any): Promise<IMovieMetaData> {
		const files = (await this.node.ls(entry.cid)).filter(f => f.type == 'file');

		return {
			...entry,
			title: entry.name,
			video: files.filter(f => f.name.endsWith('.mp4'))[0],
			thumbnails: files.filter(f => Regexes.Thumbnail.exec(f.name) != null),
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
		};
	}
}
