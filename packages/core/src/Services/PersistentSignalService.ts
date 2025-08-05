import { Signal } from '@preact/signals-core';
import { inject, injectable } from 'inversify';
import { IObjectStore, IObjectStoreSymbol, IPersistentSignalService } from 'ipmc-interfaces';

/**
 * @inheritdoc
 */
@injectable()
export class PersistentSignalService implements IPersistentSignalService {
	constructor(
		@inject(IObjectStoreSymbol) private readonly store: IObjectStore
	) { }

	/**
	 * @inheritdoc
	 */
	get<T>(storageKey: string, defaultValue: T): Signal<T> {
		if (this.signals.has(storageKey)) {
			return this.signals.get(storageKey)!;
		}

		const finalStorageKey = `persistent_signal_${storageKey}`;

		const signal = new Signal<T>(this.store.get(finalStorageKey) ?? defaultValue);
		signal.subscribe((value) => {
			this.store.set(finalStorageKey, value);
		});
		this.signals.set(storageKey, signal);
		return signal;
	}

	/**
	 * Holds all signals that have been retrieved.
	 */
	private signals = new Map<string, Signal<any>>();
}
