import { Signal } from '@preact/signals-core';
import { inject, injectable } from 'inversify';
import { HasPinAbility, IFileInfo, IIndexManager, IIndexManagerSymbol, IIpfsService, IIpfsServiceSymbol, IObjectStore, IObjectStoreSymbol, IPinItem, IPinManagerService, isIFolderFile, ITaskManager, ITaskManagerSymbol, ITranslationService, ITranslationServiceSymbol, PinStatus } from 'ipmc-interfaces';

@injectable()
export class PinManagerService implements IPinManagerService {
	public constructor(
		@inject(IIpfsServiceSymbol) private readonly ipfs: IIpfsService,
		@inject(IObjectStoreSymbol) private readonly store: IObjectStore,
		@inject(ITaskManagerSymbol) private readonly taskManager: ITaskManager,
		@inject(ITranslationServiceSymbol) private readonly translationService: ITranslationService,
		@inject(IIndexManagerSymbol) private readonly indexManager: IIndexManager,
	) {
		this.pins.value = this.store.get('pinItems') ?? [];
		this.pins.subscribe((value) => {
			this.store.set('pinItems', value);
		});
	}

	/**
	 * @inheritdoc
	 */
	public isPinned(item: HasPinAbility): PinStatus {
		return this.updates.some(pin => pin.itemId === item.pinId) ? PinStatus.Working : this.pins.peek().some(pin => pin.itemId === item.pinId) ? PinStatus.Pinned : PinStatus.UnPinned;
	}

	/**
	 * @inheritdoc
	 */
	public addPin(item: HasPinAbility): Promise<void> {
		let pin = this.pins.peek().find(pin => pin.itemId === item.pinId);
		if (pin) {
			return Promise.resolve();
		}

		pin = { itemId: item.pinId, cid: item.cid };
		this.updates.push(pin);

		return new Promise<void>((resolve) => {
			this.taskManager.runTask({
				task: () => this.ipfs.addPin(item.cid),
				onEnd: () => {
					this.pins.value = [...this.pins.value, pin];
					this.updates = this.updates.filter(pin => pin.itemId !== item.pinId);
					resolve();
				},
				title: this.translationService.translate('AddingPin', { title: item.pinId }),
			});
		});
	}

	/**
	 * @inheritdoc
	 */
	public removePin(item: HasPinAbility): Promise<void> {
		const pin = this.pins.peek().find(pin => pin.itemId === item.pinId);
		if (!pin) {
			return Promise.resolve();
		}

		this.updates.push(pin);

		return new Promise<void>((resolve) => {
			this.taskManager.runTask({
				task: () => this.ipfs.rmPin(item.cid),
				onEnd: () => {
					this.pins.value = this.pins.value.filter(pin => pin.itemId !== item.pinId);
					this.updates = this.updates.filter(pin => pin.itemId !== item.pinId);
					resolve();
				},
				title: this.translationService.translate('RemovingPin', { title: item.pinId }),
			});
		});
	}

	/**
	 * @inheritdoc
	 */
	public listPins(): IPinItem[] {
		return this.pins.value;
	}

	/**
	 * @inheritdoc
	 */
	public resolvePin(item: IPinItem): IFileInfo | undefined {
		const libId = item.itemId.substring(0, item.itemId.indexOf('/'));
		const index = this.indexManager.indexes.get(libId)?.value?.index;
		if (index) {
			return this.walkPath(item.itemId.substring(item.itemId.indexOf('/') + 1), index);
		}
		return undefined;
	}

	/**
	 * Walks a path in an index.
	 * @param path path to walk.
	 * @param items items to walk the path in.
	 * @returns The found item or undefined.
	 */
	public walkPath(path: string, items: IFileInfo[]): IFileInfo | undefined {
		const item = items.find(i => i.name == path.substring(0, path.indexOf('/') > 0 ? path.indexOf('/') : undefined));
		if (path.indexOf('/') > -1) {
			return isIFolderFile(item) ? this.walkPath(path.substring(path.indexOf('/') + 1), item.items) : undefined;
		}
		return item;
	}

	/**
	 * @inheritdoc
	 */
	public pins = new Signal<IPinItem[]>([]);

	/**
	 * The currently updating items used to get appropriate status.
	 */
	private updates: IPinItem[] = [];
}
