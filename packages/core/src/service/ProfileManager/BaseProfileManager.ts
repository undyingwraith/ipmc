import { Signal } from "@preact/signals-react";
import { IIpfsService } from '../IIpfsService';
import { ILibrary } from "../Library";
import { isMovieLibrary } from "../Library/ILibrary";
import { IProfile } from '../Profile/IProfile';
import { MovieIndexFetcher } from '../indexer/MovieIndexFetcher';
import { IProfileManager, ProfileManagerState } from "./IProfileManager";
import { ITask } from '../ITask';

export abstract class BaseProfileManager implements IProfileManager {
	protected constructor(public readonly profile: IProfile) {
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

	protected ipfs: IIpfsService | undefined;


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

	private updateLibrary(library: ILibrary): Promise<void> {
		//TODO: update root from upstream
		//TODO: verify fetch is needed
		return this.fetchIndex(library)
			.then(index => {
				const lib = this.libraries.get(library.name);
				if (lib != undefined) {
					lib.value = {
						...lib.value, index: {
							values: index,
							cid: lib.value.root,
						}
					};
				}
			});
	}

	private fetchIndex(library: ILibrary) {
		if (isMovieLibrary(library)) {
			const indexer = new MovieIndexFetcher(this.ipfs!, library);
			return indexer.fetchIndex();
		}
		return Promise.reject(new Error(`Unknown library type [${library.type}]`));
	}

	private updates = new Map<string, Promise<void>>();

	private timer: any;
}
