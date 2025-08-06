import fs from 'fs';
import type { IInternalProfile } from 'ipmc-interfaces';
import { DefaultServerProfile } from '../../DefaultServerProfile';
import type { IServerProfile } from '../../IServerProfile';
import type { IProfileService } from './IProfileService';

export class ProfileService implements IProfileService {
	get clientProfile(): IInternalProfile {
		const pro = this.profile;
		return {
			id: pro.id,
			libraries: pro.libraries.map(l => ({
				id: l.id,
				name: l.name,
				type: l.type,
				upstream: l.upstream,
			})),
			name: pro.name,
			type: 'internal',
			bootstrap: pro.bootstrap,
			port: pro.port,
			swarmKey: pro.swarmKey,
		};
	}

	get profile(): IServerProfile {
		if (!fs.existsSync(this.profileFile)) {
			return DefaultServerProfile;
		}
		const loaded = JSON.parse(fs.readFileSync(this.profileFile, 'utf-8'));
		return {
			...DefaultServerProfile,
			...loaded,
		};
	}

	updateProfile(update: Partial<IServerProfile>): void {
		fs.writeFileSync(this.profileFile, JSON.stringify({
			...this.profile,
			...update,
		}));
	}

	private profileFile = './profile.json';
}
