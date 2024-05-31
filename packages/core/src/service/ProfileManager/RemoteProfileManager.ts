import { createRemoteIpfsService } from '../../createRemoteIpfsService';
import { IRemoteProfile } from "../Profile/IRemoteProfile";
import { BaseProfileManager } from "./BaseProfileManager";

export class RemoteProfileManager extends BaseProfileManager<IRemoteProfile> {
	constructor(profile: IRemoteProfile) {
		super(profile);
	}

	protected async startNode() {
		this.ipfs = await createRemoteIpfsService(this.profile.url);
	}

	protected stopNode() {
		return Promise.resolve();
	}
}
