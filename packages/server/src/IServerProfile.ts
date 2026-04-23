import type { IInternalProfile } from 'ipmc-interfaces';
import type { IServerLibrary } from './IServerLibrary';

export interface IServerProfile extends IInternalProfile {
	/**
	 * @inheritdoc
	 */
	libraries: IServerLibrary[];

	ip4?: string;

	/**
	 * Directory where the data is stored. (default: '.')
	 */
	dataDir: string;

	/**
	 * Maximum amount of storage to use. (default: TODO)
	 */
	storageMax: string;

	/**
	 * Trusted peers TODO
	 */
	trustedPeers: string[];
}
