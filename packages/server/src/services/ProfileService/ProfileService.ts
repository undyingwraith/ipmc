import fs from 'fs';
import { inject, optional } from 'inversify';
import type { IInternalProfile } from 'ipmc-interfaces';
import { DefaultServerProfile } from '../../DefaultServerProfile';
import type { IServerProfile } from '../../IServerProfile';
import type { IProfileService } from './IProfileService';
import { DefaultProfileServiceConfiguration, IProfileServiceConfigurationSymbol, type IProfileServiceConfiguration } from './IProfileServiceConfiguration';

export class ProfileService implements IProfileService {
	constructor(
		@inject(IProfileServiceConfigurationSymbol) @optional() config?: IProfileServiceConfiguration
	) {
		this.config = { ...DefaultProfileServiceConfiguration, ...config };
	}

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
		if (!fs.existsSync(this.config.profileFile)) {
			return DefaultServerProfile;
		}
		const loaded = JSON.parse(fs.readFileSync(this.config.profileFile, 'utf-8'));
		return {
			...DefaultServerProfile,
			...loaded,
		};
	}

	updateProfile(update: Partial<IServerProfile>): void {
		fs.writeFileSync(this.config.profileFile, JSON.stringify({
			...this.profile,
			...update,
		}));
	}

	private config: IProfileServiceConfiguration;
}
