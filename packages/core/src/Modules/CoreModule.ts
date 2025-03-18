import { IIndexManagerSymbol, IKeyValueStoreSymbol, ILogServiceSymbol, IObjectStoreSymbol, IPersistentSignalServiceSymbol, IPinManagerServiceSymbol, ISortAndFilterServiceSymbol, ITaskManagerSymbol, ITranslationServiceSymbol, ITranslationsSymbol } from 'ipmc-interfaces';
import { IndexManager, LogService, MemoryKeyValueStore, ObjectStore, PersistentSignalService, PinManagerService, SortAndFilterService, TaskManager, TranslationService } from '../Services';
import de from '../translations/de.json';
import en from '../translations/en.json';
import { IModule } from './IModule';

export const CoreModule: IModule = (app) => {
	app.register(MemoryKeyValueStore, IKeyValueStoreSymbol);
	app.register(ObjectStore, IObjectStoreSymbol);
	app.register(IndexManager, IIndexManagerSymbol);
	app.register(TaskManager, ITaskManagerSymbol);
	app.register(LogService, ILogServiceSymbol);
	app.register(PersistentSignalService, IPersistentSignalServiceSymbol);
	app.register(PinManagerService, IPinManagerServiceSymbol);
	app.register(SortAndFilterService, ISortAndFilterServiceSymbol);

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
