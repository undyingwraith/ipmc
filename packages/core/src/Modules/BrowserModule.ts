import { IKeyValueStoreSymbol } from 'ipmc-interfaces';
import { LocalStorageKeyValueStore } from '../Services/LocalStorageKeyValueStore';
import { IModule } from './IModule';

export const BrowserModule: IModule = (app) => {
	app.register(LocalStorageKeyValueStore, IKeyValueStoreSymbol);
};
