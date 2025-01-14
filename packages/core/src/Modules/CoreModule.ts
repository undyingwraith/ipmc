import { IIndexManagerSymbol, IKeyValueStoreSymbol, IObjectStoreSymbol, ITranslationServiceSymbol, ITranslationsSymbol } from 'ipmc-interfaces';
import { MemoryKeyValueStore } from '../Services/MemoryKeyValueStore';
import { ObjectStore } from '../Services/ObjectStore';
import { IModule } from './IModule';
import { IndexManager } from '../Services/IndexManager';
import { TaskManager } from '../Services/TaskManager';
import { ITaskManagerSymbol } from 'ipmc-interfaces';
import { TranslationService } from '../Services/TranslationService';
import en from '../translations/en.json';
import de from '../translations/de.json';

export const CoreModule: IModule = (app) => {
	app.register(MemoryKeyValueStore, IKeyValueStoreSymbol);
	app.register(ObjectStore, IObjectStoreSymbol);
	app.register(IndexManager, IIndexManagerSymbol);
	app.register(TaskManager, ITaskManagerSymbol);
	app.register(TranslationService, ITranslationServiceSymbol);
	app.registerConstantMultiple({
		en: {
			translation: en,
		},
		de: {
			translation: de,
		}
	}, ITranslationsSymbol);
};
