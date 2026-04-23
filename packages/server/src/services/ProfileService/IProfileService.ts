import type { IInternalProfile } from 'ipmc-interfaces';
import type { IServerProfile } from '../../IServerProfile';

export const IProfileServiceSymbol = Symbol.for('IProfileService');

export interface IProfileService {
	get profile(): IServerProfile;

	get clientProfile(): IInternalProfile;

	updateProfile(update: Partial<IServerProfile>): void;
}
