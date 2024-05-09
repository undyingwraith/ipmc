import { IRemoteProfile } from "../Profile/IRemoteProfile";
import { BaseProfileManager } from "./BaseProfileManager";

export class RemoteProfileManager extends BaseProfileManager {
	constructor(profile: IRemoteProfile) {
		super(profile);
	}

	protected startNode() {
		return Promise.reject();
	}

	protected stopNode() {
		return Promise.reject();
	}
}
