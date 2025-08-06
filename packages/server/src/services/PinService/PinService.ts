import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import { IIpfsServiceSymbol, ILogServiceSymbol, type IIpfsService, type ILogService } from 'ipmc-interfaces';
import { IProfileServiceSymbol, type IProfileService } from '../ProfileService';

@injectable()
export class PinService {
	constructor(
		@inject(ILogServiceSymbol) private readonly log: ILogService,
		@inject(IProfileServiceSymbol) private readonly profileService: IProfileService,
		@inject(IIpfsServiceSymbol) private readonly ipfs: IIpfsService,
	) { }

	@postConstruct()
	public start() {
		void this.updatePins();
		this.interval = setInterval(() => {
			void this.updatePins();
		}, 1000 * 60 * 60);
	}

	@preDestroy()
	public stop() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	public async updatePins(): Promise<void> {
		const cids: string[] = [];

		for (const lib of this.profileService.profile.libraries) {
			if (!lib.keepPinned) {
				this.log.debug(`Skipping pinning library '${lib.name}'.`);
				continue;
			}
			try {
				const current = await this.ipfs.resolve(lib.upstream);
				cids.push(current);
				await this.ipfs.addPin(current);
				this.log.info(`Library '${lib.name}' pinned!`);
			} catch (ex) {
				this.log.error(ex);
				this.log.error(`Failed to update library '${lib.name}'`);
			}
		}

		this.log.info('All libraries updated!');

		const pins = await this.ipfs.lsPins();
		if (pins.length != this.profileService.profile.libraries.filter(lib => !!lib.keepPinned).length) {
			this.log.info('Not all libraries successfuly updated skipping cleanup');
			return;
		}
		for (const pin of pins) {
			if (!cids.includes(pin)) {
				await this.ipfs.rmPin(pin);
			}
		}

		this.log.info('Cleaned old pins!');
	}

	private interval;
}
