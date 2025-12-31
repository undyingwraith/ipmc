import { Signal } from '@preact/signals-core';
import { inject, injectable, multiInject, postConstruct, preDestroy } from 'inversify';
import { IIndexManager, IIpfsService, IIpfsServiceSymbol, ILibrary, ILibraryIndex, ILogService, ILogServiceSymbol, IObjectStore, IObjectStoreSymbol, IProfile, IProfileSymbol, ITaskManager, ITaskManagerSymbol, ITranslationService, ITranslationServiceSymbol, IUpdateOptions } from 'ipmc-interfaces';
import { IIndexFetcher, IIndexFetcherSymbol } from './Indexer';

@injectable()
export class IndexManager implements IIndexManager {
	public constructor(
		@inject(IProfileSymbol) private readonly profile: IProfile,
		@inject(IIpfsServiceSymbol) private readonly ipfs: IIpfsService,
		@inject(IObjectStoreSymbol) private readonly objectStore: IObjectStore,
		@inject(ITaskManagerSymbol) private readonly taskManager: ITaskManager,
		@inject(ITranslationServiceSymbol) private readonly translationService: ITranslationService,
		@inject(ILogServiceSymbol) private readonly log: ILogService,
		@multiInject(IIndexFetcherSymbol) private readonly indexers: IIndexFetcher<any>[],
	) {
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
		this.updates.forEach(e => {
			e.abort();
		});
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
				task: (onProgress) => this.update(lib, { signal: controller.signal, onProgress }),
				title: this.translationService.translate('UpdatingLibrary', { name: lib.name }),
				onEnd: () => {
					this.updates.delete(lib.id);
				},
			});
		}
	}

	public async update(library: ILibrary, options?: Partial<IUpdateOptions>): Promise<void> {
		const signal = options?.signal ?? new AbortController().signal;
		const onProgress = options?.onProgress ?? (() => { });
		const force = options?.force ?? false;
		const index = this.indexes.get(library.id);
		if (library.upstream != undefined && index != undefined) {
			try {
				const cid = await this.ipfs.resolve(library.upstream);
				const indexer = this.indexers.find(i => i.canIndex(library));
				if (index.value?.cid != cid || indexer?.version !== index.value.indexer || force) {
					if (indexer == undefined) {
						throw new Error(`Unknown library type [${library.type}]`);
					}
					const old = indexer.version !== index.value?.indexer || force ? undefined : index.value.index;

					const newIndex = await indexer.fetchIndex({
						libraryId: library.id,
						cid,
						abortSignal: signal,
						onProgress,
						old,
					});

					index.value = {
						cid: cid,
						indexer: indexer.version,
						index: newIndex,
					};
				}
			} catch (ex: any) {
				this.log.error(ex);
				throw ex;
			}
		}
	}

	private updates = new Map<string, AbortController>();

	private timer: any;
}
