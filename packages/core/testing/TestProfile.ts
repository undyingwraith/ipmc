import { IProfile } from 'ipmc-interfaces';

export const TestProfile: IProfile = {
	id: 'test',
	libraries: [
		{
			id: 'test',
			name: 'movies',
			type: 'movie',
			upstream: 'mov.upstream'
		},
	],
	name: 'test',
	type: 'remote'
};
