import { IConfigurationService } from "../IConfigurationService";
import { IIpfsService } from "../IIpfsService";
import { IGenericLibrary } from "../Library";
import { IProfile } from "../Profile";
import { IFileInfo } from "./IFileInfo";
import { IMovieMetaData } from "../Library/IMovieMetaData";
import { Regexes } from "./Regexes";

export class MovieIndexer {
	constructor(private readonly node: IIpfsService, private readonly config: IConfigurationService, private readonly profile: IProfile, private readonly lib: IGenericLibrary<IMovieMetaData, 'movie'>) {
	}

	public async fetchIndex(): Promise<IMovieMetaData[]> {
		if (this.lib.index?.values != undefined && this.lib.index?.cid == this.lib.root) {
			return this.lib.index.values;
		}

		const files = (await this.node.ls(this.lib.root.toString())).filter(f => f.type == 'dir');
		const index = [];
		for (const file of files) {
			index.push(await this.extractMovieMetaData(this.node, file));
		}

		this.lib.index = {
			values: index,
			cid: this.lib.root,
		}

		this.config.setProfile(this.profile.name, { ...this.profile, libraries: this.profile.libraries.map(l => l.name != this.lib.name ? l : this.lib) })

		return this.lib.index.values;
	}

	public async extractMovieMetaData(node: IIpfsService, entry: IFileInfo, skeleton?: any): Promise<IMovieMetaData> {
		const files = (await this.node.ls(entry.cid)).filter(f => f.type == 'file');

		return {
			title: entry.name,
			file: files.filter(f => f.name.endsWith('.mp4'))[0],
			thumbnails: files.filter(f => Regexes.Thumbnail.exec(f.name) != null),
			posters: files.filter(f => Regexes.Poster.exec(f.name) != null),
		}
	}
}
