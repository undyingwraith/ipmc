import { Signal } from "@preact/signals-react";
import { IIpfsService, ILibrary, IProfile, isMovieLibrary, isSeriesLibrary } from 'ipmc-interfaces';
import { ITask } from '../ITask';
import { MovieIndexFetcher, SeriesIndexFetcher } from '../indexer';
import { IProfileManager, ProfileManagerState } from "./IProfileManager";

export abstract class BaseProfileManager<TProfile extends IProfile> implements IProfileManager {
	protected constructor(public readonly profile: TProfile) {
		for (const lib of this.profile.libraries) {
			this.libraries.set(lib.name, new Signal<ILibrary>(lib));
		}
	}

	public start(): Promise<void> {
		return this.startNode()
			.then(() => {
				this.triggerUpdate();
				this.timer = setInterval(() => {
					this.triggerUpdate();
				}, 15 * 60 * 1000);
				this.state.value = ProfileManagerState.Running;
			});
	}

	public stop(): Promise<void> {
		clearInterval(this.timer);
		return this.stopNode()
			.then(() => {
				this.state.value = ProfileManagerState.Stopped;
			});
	}

	public libraries = new Map<string, Signal<ILibrary>>();

	public state = new Signal<ProfileManagerState>(ProfileManagerState.Stopped);

	public tasks = new Signal<ITask[]>([]);


	protected abstract startNode(): Promise<void>;

	protected abstract stopNode(): Promise<void>;

	public ipfs: IIpfsService | undefined;


	private triggerUpdate(): void {
		for (const library of this.libraries.values()) {
			const lib = library.value;
			if (!this.updates.has(lib.name)) {
				const task = {
					title: 'Updating library ' + lib.name,
				};
				this.tasks.value = [...this.tasks.value, task];
				this.updates.set(lib.name, this.updateLibrary(lib).finally(() => {
					this.updates.delete(lib.name);
					this.tasks.value = this.tasks.value.filter(t => t != task);
				}));
			}
		}
	}

	private async updateLibrary(library: ILibrary): Promise<void> {
		if (library.upstream != undefined) {
			try {
				const cid = await this.ipfs!.resolve(library.upstream);
				if (library.root != cid) {
					const lib = this.libraries.get(library.name);
					if (lib != undefined) {
						lib.value = {
							...lib.value, root: cid
						};
					}
				}
			} catch (ex) {
				console.error(ex);
			}
		}

		if (library.index?.cid !== library.root || library.index?.cid !== undefined) {
			const lib = this.libraries.get(library.name);
			if (lib != undefined) {
				const indexer = isMovieLibrary(lib.value) ? new MovieIndexFetcher(this.ipfs!, lib.value) : isSeriesLibrary(lib.value) ? new SeriesIndexFetcher(this.ipfs!, lib.value) : undefined;
				if (indexer == undefined) {
					throw new Error(`Unknown library type [${library.type}]`);
				}

				const index = await indexer.fetchIndex();

				//@ts-ignore
				lib.value = {
					...lib.value, index: {
						values: index,
						cid: lib.value.root,
					}
				};
			}
		}
	}

	private updates = new Map<string, Promise<void>>();

	private timer: any;
}
