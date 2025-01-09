import { IFileInfo, IIpfsService, ILibrary, IMovieMetaData, IOnProgress } from 'ipmc-interfaces';
import { Regexes } from '../../Regexes';
import { IIndexFetcher } from './IIndexFetcher';

export class MovieIndexFetcher implements IIndexFetcher<IMovieMetaData[]> {
	constructor(private readonly node: IIpfsService) {
	}

	public version = '0';

	public async fetchIndex(cid: string, onProgress: IOnProgress): Promise<IMovieMetaData[]> {
		const files = (await this.node.ls(cid)).filter(f => f.type == 'dir');
		const index = [];
		for (const [i, file] of files.entries()) {
			try {
				index.push(await this.extractMovieMetaData(this.node, file));
			} catch (ex) {
				console.error(ex);
			}
			onProgress(i, files.length);
		}

		return index;
	}

	public async extractMovieMetaData(node: IIpfsService, entry: IFileInfo, skeleton?: any): Promise<IMovieMetaData> {
		const files = (await this.node.ls(entry.cid)).filter(f => f.type == 'file');
		const videoFile = files.find(f => Regexes.VideoFile('mpd').exec(f.name) != null);

		if (!videoFile) throw new Error('Failed to find video file in ' + entry.name + '|' + entry.cid);

		const videoData = Regexes.VideoFile('mpd').exec(videoFile.name)!;

		return {
			...entry,
			title: videoData[1],
			year: videoData[2] != null ? parseInt(videoData[2]) : undefined,
			video: videoFile,
			thumbnails: files.filter(f => Regexes.Thumbnail.exec(f.name) != null),
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
		};
	}

	public canIndex(library: ILibrary): boolean {
		return library.type === 'movie';
	}
}
