import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import { IIpfsServiceSymbol, ILogServiceSymbol, IProfileSymbol, type IIpfsService, type ILogService } from 'ipmc-interfaces';
import type { IServerProfile } from '../IServerProfile';

export const IPinServiceSymbol = Symbol.for('IPinService');

@injectable()
export class PinService {
	constructor(
		@inject(ILogServiceSymbol) private readonly log: ILogService,
		@inject(IProfileSymbol) private readonly profile: IServerProfile,
		@inject(IIpfsServiceSymbol) private readonly ipfs: IIpfsService,
	) {

	}

	@postConstruct()
	public start() {
		this.updatePins();
		this.interval = setInterval(() => {
			this.updatePins();
		}, 1000 * 60 * 60);
	}

	@preDestroy()
	public stop() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	public updatePins() {
		//TODO: remove old pins
		Promise.all(this.profile.libraries.map(async lib => {
			if (!lib.keepPinned) {
				this.log.debug(`Skipping pinning library '${lib.name}'.`);
				return;
			}
			try {
				const current = await this.ipfs.resolve(lib.upstream);
				await this.ipfs.addPin(current);
				this.log.info(`Library '${lib.name}' pinned!`);
			} catch (ex) {
				this.log.error(ex);
				this.log.error(`Failed to update library '${lib.name}'`);
			}
		})).then(() => {
			this.log.info('All libraries updated!');
		});
	}

	private interval;
}
