import { IIpfsService } from "../IIpfsService";
import { IGenericLibrary } from "../Library";
import { IMovieMetaData } from "../Library/IMovieMetaData";
import { IFileInfo } from "./IFileInfo";
import { IIndexFetcher } from './IIndexFetcher';
import { Regexes } from "./Regexes";

export class MovieIndexFetcher implements IIndexFetcher<IMovieMetaData[]> {
	constructor(private readonly node: IIpfsService, private readonly lib: IGenericLibrary<IMovieMetaData, 'movie'>) {
	}

	public async fetchIndex(): Promise<IMovieMetaData[]> {
		const files = (await this.node.ls(this.lib.root.toString())).filter(f => f.type == 'dir');
		const index = [];
		for (const file of files) {
			index.push(await this.extractMovieMetaData(this.node, file));
		}

		return index;
	}

	public async extractMovieMetaData(node: IIpfsService, entry: IFileInfo, skeleton?: any): Promise<IMovieMetaData> {
		const files = (await this.node.ls(entry.cid)).filter(f => f.type == 'file');

		return {
			title: entry.name,
			file: files.filter(f => f.name.endsWith('.mp4'))[0],
			thumbnails: files.filter(f => Regexes.Thumbnail.exec(f.name) != null),
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
		};
	}
}
