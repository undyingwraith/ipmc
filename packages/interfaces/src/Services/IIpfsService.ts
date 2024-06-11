import { IFileInfo } from '../MetaData';

export interface IIpfsService {
	/**
	 * Checks whether a cid is pinned.
	 * @param cid cid to check pin status of.
	 */
	isPinned(cid: string): Promise<boolean>;

	/**
	 * Adds a new pin.
	 * @param cid cid to pin.
	 */
	addPin(cid: string): Promise<void>;

	/**
	 * Removes a pin.
	 * @param cid cid to remove pin.
	 */
	rmPin(cid: string): Promise<void>;

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

	/**
	 * Resolves a ipns address.
	 * @param ipns ipns address.
	 */
	resolve(ipns: string): Promise<string>;

	/**
	 * Returns node id.
	 */
	id(): string;
}
