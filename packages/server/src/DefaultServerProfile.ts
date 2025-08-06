import { uuid } from 'ipmc-core';
import type { IServerProfile } from './IServerProfile';

export const DefaultServerProfile: IServerProfile = {
	id: uuid(),
	libraries: [],
	name: 'Default',
	type: 'internal',
	apiPort: 3000,
	tempDir: './tmp',
	dataDir: './data',
	blocksDir: './blocks'
};
