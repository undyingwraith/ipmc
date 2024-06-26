import { Signal } from '@preact/signals-core';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import { IIndexManager, IIpfsService, IIpfsServiceSymbol, ILibrary, ILibraryIndex, IObjectStore, IObjectStoreSymbol, IProfile, IProfileSymbol, ITask, isMovieLibrary, isSeriesLibrary } from 'ipmc-interfaces';
import { MovieIndexFetcher, SeriesIndexFetcher } from './Indexer';
import { ITaskManager, ITaskManagerSymbol } from 'ipmc-interfaces';

@injectable()
export class IndexManager implements IIndexManager {
	public constructor(
		@inject(IProfileSymbol) private readonly profile: IProfile,
		@inject(IIpfsServiceSymbol) private readonly ipfs: IIpfsService,
		@inject(IObjectStoreSymbol) private readonly objectStore: IObjectStore,
		@inject(ITaskManagerSymbol) private readonly taskManager: ITaskManager
	) {
		for (const lib of this.profile.libraries) {
			this.libraries.set(lib.name, new Signal<ILibrary>(lib));
			const indexSignal = new Signal<ILibraryIndex<any> | undefined>(this.objectStore.get(this.getIndexStorageKey(lib.name)));
			this.indexes.set(lib.name, indexSignal);
			indexSignal.subscribe((newState) => {
				if (newState !== undefined) {
					this.objectStore.set(this.getIndexStorageKey(lib.name), newState);
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

	public tasks = new Signal<ITask[]>([]);

	private getIndexStorageKey(name: string) {
		return `${this.profile.id}_index_${name}`;
	}

	private triggerUpdate(): void {
		for (const library of this.libraries.values()) {
			const lib = library.value;
			if (!this.updates.has(lib.name)) {
				this.taskManager.runTask({
					task: () => this.updateLibrary(lib),
					title: '',
					onEnd: () => {
						this.updates.delete(lib.name);
					},
				});
			}
		}
	}

	private async updateLibrary(library: ILibrary): Promise<void> {
		const index = this.indexes.get(library.name);
		if (library.upstream != undefined && index != undefined) {
			try {
				const cid = await this.ipfs.resolve(library.upstream);
				const indexer = isMovieLibrary(library) ? new MovieIndexFetcher(this.ipfs) : isSeriesLibrary(library) ? new SeriesIndexFetcher(this.ipfs) : undefined;
				if (index.value?.cid != cid || indexer?.version !== index.value.indexer) {
					if (indexer == undefined) {
						throw new Error(`Unknown library type [${library.type}]`);
					}

					const newIndex = await indexer.fetchIndex(cid);

					index.value = {
						cid: cid,
						indexer: indexer.version,
						index: newIndex,
					};
				}
			} catch (ex) {
				console.error(ex);
			}
		}
	}

	private libraries = new Map<string, Signal<ILibrary>>();

	private updates = new Map<string, Promise<void>>();

	private timer: any;
}
