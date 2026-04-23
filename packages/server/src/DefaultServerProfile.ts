import { uuid } from 'ipmc-core';
import type { IServerProfile } from './IServerProfile';

export const DefaultServerProfile: IServerProfile = {
	id: uuid(),
	libraries: [],
	name: 'Default',
	type: 'internal',
	dataDir: '.',
	trustedPeers: [],
	storageMax: 'TODO',
};
