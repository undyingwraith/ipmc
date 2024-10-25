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
			try {
				index.push(await this.extractMovieMetaData(this.node, file));
			} catch (ex) {
				console.error(ex);
			}
		}

		return index;
	}

	public async extractMovieMetaData(node: IIpfsService, entry: IFileInfo, skeleton?: any): Promise<IMovieMetaData> {
		const files = (await this.node.ls(entry.cid)).filter(f => f.type == 'file');
		const videoFile = files.find(f => f.name.endsWith('.mpd'));

		if (!videoFile) throw new Error('Failed to find video file in ' + entry.name + '|' + entry.cid);

		return {
			...entry,
			title: videoFile.name.substring(0, videoFile.name.lastIndexOf('.')),
			video: videoFile,
			thumbnails: files.filter(f => Regexes.Thumbnail.exec(f.name) != null),
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
		};
	}
}
