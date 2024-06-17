import { IIpfsService, IProfile } from 'ipmc-interfaces';
import { BaseProfileManager } from './BaseProfileManager';

export class SimpleProfileManager extends BaseProfileManager<IProfile> {
	constructor(ipfs: IIpfsService, profile: IProfile) {
		super(profile);
		this.ipfs = ipfs;
	}

	protected startNode(): Promise<void> {
		return Promise.resolve();
	}

	protected stopNode(): Promise<void> {
		return this.ipfs?.stop() ?? Promise.resolve();
	}
}
