import { IIpfsService } from '../IIpfsService';
import { IProfile } from '../Profile/IProfile';
import { BaseProfileManager } from './BaseProfileManager';

export class SimpleProfileManager extends BaseProfileManager {
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
