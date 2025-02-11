import { HasPinAbility, IIpfsServiceSymbol, IKeyValueStoreSymbol, IPinManagerService, IPinManagerServiceSymbol, PinStatus } from 'ipmc-interfaces';
import { describe, expect, test } from 'vitest';
import { Application, CoreModule, MemoryKeyValueStore } from '../../src';
import { MockIpfsService } from '../../testing';

describe('PinManagerService', () => {
	const app = new Application();
	app.use(CoreModule);
	app.register(MockIpfsService, IIpfsServiceSymbol);
	app.register(MemoryKeyValueStore, IKeyValueStoreSymbol);

	test('Can add and remove a pin', async () => {
		const manager = app.getService<IPinManagerService>(IPinManagerServiceSymbol)!;
		const item: HasPinAbility = {
			cid: 'test',
			pinId: 'this is a test id'
		};
		let pinChanges = -1;
		manager.pins.subscribe(() => {
			pinChanges++;
		});

		expect(manager.listPins()).toEqual([]);

		await manager.addPin(item);

		expect(pinChanges).toBe(1);
		expect(manager.listPins().length).toBe(1);
		expect(manager.isPinned(item)).toBe(PinStatus.Pinned);

		await manager.removePin(item);

		expect(pinChanges).toBe(2);
		expect(manager.listPins()).toEqual([]);
		expect(manager.isPinned(item)).toBe(PinStatus.UnPinned);
	});
});
