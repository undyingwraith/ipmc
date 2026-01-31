import { IFileInfo } from '../MetaData';

export const IIpfsServiceSymbol = Symbol.for('IIpfsService');

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
	 * @param signal {@link AbortSignal} to abort the operation.
	 */
	ls(cid: string, signal?: AbortSignal): Promise<IFileInfo[]>;

	/**
	 * Lists all connected peers.
	 */
	peers(): Promise<{ peer: string, addrs: string[]; }[]>;

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

	/**
	 * Fetches a block.
	 * @param cid cid of the block to fetch.
	 */
	fetch(cid: string, options?: IFetchOptions): Promise<Uint8Array>;

	/**
	 * Fetches a block.
	 * @deprecated use {@link IFetchOptions} instead.
	 * @param cid cid of the block to fetch.
	 * @param path (optional) path inside the cid.
	 */
	fetch(cid: string, path?: string): Promise<Uint8Array>;
}

export interface IFetchOptions {
	/**
	 * An optional path to allow reading files inside directories.
	 */
	path?: string;

	/**
	 * Stop reading the file after this many bytes.
	 */
	length?: number;

	/**
	 * Start reading the file at this offset.
	 */
	offset?: number;
}
