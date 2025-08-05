import { beforeEach, describe, expect, test } from 'vitest';
import { Application, MemoryKeyValueStore, ObjectStore, PersistentSignalService } from '../../src';
import { IKeyValueStoreSymbol, IObjectStoreSymbol, IPersistentSignalService, IPersistentSignalServiceSymbol } from 'ipmc-interfaces';

describe('PersistentSignalService', () => {
	let app: Application;

	beforeEach(() => {
		app = new Application();
		app.register(MemoryKeyValueStore, IKeyValueStoreSymbol);
		app.register(ObjectStore, IObjectStoreSymbol);
		app.register(PersistentSignalService, IPersistentSignalServiceSymbol);
	});

	test('Values remain the same with same key', () => {
		const service = app.getService<IPersistentSignalService>(IPersistentSignalServiceSymbol)!;

		const name = 'test';
		const signal1 = service.get(name, 'default');
		const signal2 = service.get(name, 'default2');

		expect(signal1.peek()).toEqual(signal2.peek());
		expect(signal1.peek()).toEqual('default');
	});

	test('Signals retrieved with the same name have the same value', () => {
		const service = app.getService<IPersistentSignalService>(IPersistentSignalServiceSymbol)!;

		const name = 'test';
		const signal1 = service.get(name, 'default');
		const signal2 = service.get(name, 'default2');

		expect(signal1.peek()).toEqual(signal2.peek());

		signal1.value = 'new test';

		expect(signal1.peek()).toEqual(signal2.peek());
		expect(signal1.peek()).toEqual('new test');
	});
});
