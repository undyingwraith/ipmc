import type { IInternalProfile } from 'ipmc-interfaces';
import type { IServerLibrary } from './IServerLibrary';

export interface IServerProfile extends IInternalProfile {
	/**
	 * @inheritdoc
	 */
	libraries: IServerLibrary[];

	/**
	 * Port for the server api. (default: 3000)
	 */
	apiPort?: number;

	/**
	 * Temporary directory used for processing. (default: './tmp')
	 */
	tempDir?: string;

	/**
	 * Directory where the node data is stored. (default: './data')
	 */
	dataDir?: string;

	/**
	 * Directory where the node blocks are stored. (default: './blocks')
	 */
	blocksDir?: string;
}
