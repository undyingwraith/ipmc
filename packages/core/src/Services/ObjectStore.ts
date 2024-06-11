import { injectable, inject } from 'inversify';
import { IKeyValueStore, IObjectStore, IKeyValueStoreSymbol } from 'ipmc-interfaces';

@injectable()
export class ObjectStore implements IObjectStore {
	constructor(
		@inject(IKeyValueStoreSymbol) private readonly store: IKeyValueStore
	) {
		//NOOP
	}

	public set<T extends object>(key: string, value: T) {
		this.store.set(key, JSON.stringify(value));
	}

	public get(key: string) {
		const value = this.store.get(key);
		return value !== undefined ? JSON.parse(value) : value;
	}
}
