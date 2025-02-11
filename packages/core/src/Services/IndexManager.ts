import { Signal } from '@preact/signals-core';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import { IIndexManager, IIpfsService, IIpfsServiceSymbol, ILibrary, ILibraryIndex, ILogService, ILogServiceSymbol, IObjectStore, IObjectStoreSymbol, IOnProgress, IProfile, IProfileSymbol, ITask, ITaskManager, ITaskManagerSymbol, ITranslationService, ITranslationServiceSymbol } from 'ipmc-interfaces';
import { IIndexFetcher, MovieIndexFetcher, SeriesIndexFetcher } from './Indexer';

@injectable()
export class IndexManager implements IIndexManager {
	public constructor(
		@inject(IProfileSymbol) private readonly profile: IProfile,
		@inject(IIpfsServiceSymbol) private readonly ipfs: IIpfsService,
		@inject(IObjectStoreSymbol) private readonly objectStore: IObjectStore,
		@inject(ITaskManagerSymbol) private readonly taskManager: ITaskManager,
		@inject(ITranslationServiceSymbol) private readonly translationService: ITranslationService,
		@inject(ILogServiceSymbol) private readonly log: ILogService,
	) {
		this.indexers.push(new MovieIndexFetcher(this.ipfs));
		this.indexers.push(new SeriesIndexFetcher(this.ipfs));

		for (const lib of this.profile.libraries) {
			const indexSignal = new Signal<ILibraryIndex<any> | undefined>(this.objectStore.get(this.getIndexStorageKey(lib.id)));
			this.indexes.set(lib.id, indexSignal);
			indexSignal.subscribe((newState) => {
				if (newState !== undefined) {
					this.objectStore.set(this.getIndexStorageKey(lib.id), newState);
				}
			});
		}
	}

	@postConstruct()
	public start(): void {
		this.triggerUpdate();
		this.timer = setInterval(() => {
			this.triggerUpdate();
		}, 15 * 60 * 1000);
	}

	@preDestroy()
	public stop(): void {
		clearInterval(this.timer);
	}

	public indexes = new Map<string, Signal<ILibraryIndex<any> | undefined>>();

	private getIndexStorageKey(id: string) {
		return `${this.profile.id}_index_${id}`;
	}

	private triggerUpdate(): void {
		for (const lib of this.profile.libraries) {
			if (this.updates.has(lib.id)) {
				this.updates.get(lib.id)!.abort();
			}
			const controller = new AbortController();
			this.updates.set(lib.id, controller);
			this.taskManager.runTask({
				task: (onProgress) => this.updateLibrary(lib, controller.signal, onProgress),
				title: this.translationService.translate('UpdatingLibrary', { name: lib.name }),
				onEnd: () => {
					this.updates.delete(lib.id);
				},
			});
		}
	}

	private async updateLibrary(library: ILibrary, signal: AbortSignal, onProgress: IOnProgress): Promise<void> {
		const index = this.indexes.get(library.id);
		if (library.upstream != undefined && index != undefined) {
			try {
				const cid = await this.ipfs.resolve(library.upstream);
				const indexer = this.indexers.find(i => i.canIndex(library));
				if (index.value?.cid != cid || indexer?.version !== index.value.indexer) {
					if (indexer == undefined) {
						throw new Error(`Unknown library type [${library.type}]`);
					}

					const newIndex = await indexer.fetchIndex(library.id, cid, signal, onProgress);

					index.value = {
						cid: cid,
						indexer: indexer.version,
						index: newIndex,
					};
				}
			} catch (ex: any) {
				this.log.error(ex);
			}
		}
	}

	private indexers: IIndexFetcher<any>[] = [];

	private updates = new Map<string, AbortController>();

	private timer: any;
}
