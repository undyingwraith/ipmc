import { IKeyValueStoreSymbol, IObjectStore, IObjectStoreSymbol } from 'ipmc-interfaces';
import { beforeEach, describe, expect, test } from 'vitest';
import { Application, MemoryKeyValueStore, ObjectStore } from '../../src';

describe('ObjectStore', () => {
	let app: Application;

	beforeEach(() => {
		app = new Application();
		app.register(MemoryKeyValueStore, IKeyValueStoreSymbol);
		app.register(ObjectStore, IObjectStoreSymbol);
	});

	test('can store and load object', () => {
		const store = app.getService<IObjectStore>(IObjectStoreSymbol)!;

		const key = 'test', obj = { key: 'value' };

		store.set(key, obj);

		expect(store.get(key)).toEqual(obj);
	});
});
