import { IKeyValueStoreSymbol, IObjectStoreSymbol } from 'ipmc-interfaces';
import { MemoryKeyValueStore } from '../Services/MemoryKeyValueStore';
import { ObjectStore } from '../Services/ObjectStore';
import { IModule } from './IModule';

export const CoreModule: IModule = (app) => {
	app.register(MemoryKeyValueStore, IKeyValueStoreSymbol);
	app.register(ObjectStore, IObjectStoreSymbol);
};
