import { IHotkeyServiceSymbol, IKeyValueStoreSymbol } from 'ipmc-interfaces';
import { HotkeyService, LocalStorageKeyValueStore } from '../Services';
import { IModule } from './IModule';

export const BrowserModule: IModule = (app) => {
	app.register(LocalStorageKeyValueStore, IKeyValueStoreSymbol);
	app.register(HotkeyService, IHotkeyServiceSymbol);
};
