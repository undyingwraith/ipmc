import type { IServerProfile } from './IServerProfile';

export const DefaultServerProfile: Partial<IServerProfile> = {
	apiPort: 3000,
	tempDir: './tmp',
	dataDir: './data',
	blocksDir: './blocks'
};
