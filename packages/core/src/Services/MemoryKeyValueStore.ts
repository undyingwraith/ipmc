import { injectable } from 'inversify';
import { IKeyValueStore } from 'ipmc-interfaces';

/**
 * @inheritdoc
 */
@injectable()
export class MemoryKeyValueStore implements IKeyValueStore {
	/**
	 * @inheritdoc
	 */
	get(key: string) {
		return this.values.get(key);
	}

	/**
	 * @inheritdoc
	 */
	set(key: string, value: string) {
		this.values.set(key, value);
	}

	private values = new Map<string, string>();
}
