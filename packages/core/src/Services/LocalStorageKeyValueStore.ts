import { injectable } from 'inversify';
import { IKeyValueStore } from 'ipmc-interfaces';

/**
 * @inheritdoc
 */
@injectable()
export class LocalStorageKeyValueStore implements IKeyValueStore {
	/**
	 * @inheritdoc
	 */
	set(key: string, value: string): void {
		localStorage.setItem(key, value);
	}

	/**
	 * @inheritdoc
	 */
	get(key: string): string | undefined {
		return localStorage.getItem(key) ?? undefined;
	}

}
