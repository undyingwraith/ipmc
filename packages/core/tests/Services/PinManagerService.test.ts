import { HasPinAbility, IFileInfo, IFolderFile, IIpfsServiceSymbol, IKeyValueStoreSymbol, IPinManagerService, IPinManagerServiceSymbol, IProfile, IProfileSymbol, PinStatus } from 'ipmc-interfaces';
import { describe, expect, test } from 'vitest';
import { Application, CoreModule, MemoryKeyValueStore, PinManagerService } from '../../src';
import { MockIpfsService, TestProfile } from '../../testing';

describe('PinManagerService', () => {
	const app = new Application();
	app.use(CoreModule);
	app.register(MockIpfsService, IIpfsServiceSymbol);
	app.register(MemoryKeyValueStore, IKeyValueStoreSymbol);
	app.registerConstant<IProfile>(TestProfile, IProfileSymbol);

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

	test('walkPath works', () => {
		const manager = app.getService<PinManagerService>(IPinManagerServiceSymbol)!;
		const stuff: IFolderFile[] = [
			{
				name: 'test',
				items: [
					{
						name: 'test2',
						cid: 'test2',
						type: 'file',
					}
				],
				cid: 'test',
				type: 'dir',
			},
		];
		const res = manager.walkPath('test/test2', stuff);

		expect(res).not.toBeUndefined();
		expect(res!.name).toBe('test2');
	});
});
