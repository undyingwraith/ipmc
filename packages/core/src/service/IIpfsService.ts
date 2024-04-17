import { IFileInfo } from './indexer/IFileInfo';

export interface IIpfsService {
	/**
	 * Lists the content of a directory.
	 * @param cid cid of the directory to list.
	 */
	ls(cid: string): Promise<IFileInfo[]>;

	/**
	 * Gets a url of the file.
	 * @param cid cid of the file to get the url to.
	 */
	toUrl(cid: string): string;

	peers(): Promise<string[]>;

	/**
	 * Stops the node.
	 */
	stop(): Promise<void>;
}
