import { CID , IPFSHTTPClient } from "kubo-rpc-client";

export async function extractMetaData(node: IPFSHTTPClient, entry: any, skeleton?: any): Promise<IMetaData> {
	const files: IFileInfo[] = []
	for await (const file of node.ls(entry.cid)) {
		if (file.type == 'file') {
			files.push({
				name: file.name,
				path: `./${entry.name}/${file.name}`,
				cid: file.cid,
			});
		}
	}
	
	return {
		title: entry.name,
		video: files.filter(f => f.name.endsWith('.mp4'))[0],
		thumbnails: files.filter(f => /thumb\d*\.(jpg|jpeg|png)/.exec(f.name) != null),
		posters: files.filter(f => /poster\d*\.(jpg|jpeg|png)/.exec(f.name) != null),
	}
}

export interface IMetaData {
	title: string
	video: IFileInfo
	thumbnails: IFileInfo[]
	posters: IFileInfo[]
	year?: number
}

export interface IFileInfo {
	cid: CID;
	name: string;
	path: string;
}