import { IIndexManagerSymbol, IKeyValueStoreSymbol, ILogServiceSymbol, IObjectStoreSymbol, IPersistentSignalServiceSymbol, IPinManagerServiceSymbol, ITaskManagerSymbol, ITranslationServiceSymbol, ITranslationsSymbol } from 'ipmc-interfaces';
import { IndexManager, LogService, MemoryKeyValueStore, ObjectStore, PersistentSignalService, PinManagerService, TaskManager, TranslationService } from '../Services';
import de from '../translations/de.json';
import en from '../translations/en.json';
import { IModule } from './IModule';

export const CoreModule: IModule = (app) => {
	app.register(MemoryKeyValueStore, IKeyValueStoreSymbol);
	app.register(ObjectStore, IObjectStoreSymbol);
	app.register(IndexManager, IIndexManagerSymbol);
	app.register(TaskManager, ITaskManagerSymbol);
	app.register(LogService, ILogServiceSymbol);
	app.register(PinManagerService, IPinManagerServiceSymbol);
	app.register(PersistentSignalService, IPersistentSignalServiceSymbol);

	//Translations
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
