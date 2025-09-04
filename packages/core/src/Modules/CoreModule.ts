import { IIndexManagerSymbol, IKeyValueStoreSymbol, ILogServiceSymbol, IObjectStoreSymbol, IPersistentSignalServiceSymbol, IPinManagerServiceSymbol, ISortAndFilterServiceSymbol, ITaskManagerSymbol, ITranslationServiceSymbol, ITranslationsSymbol } from 'ipmc-interfaces';
import { IIndexFetcherSymbol, IndexManager, LogService, MemoryKeyValueStore, MovieIndexFetcher, AudioIndexFetcher, ObjectStore, PersistentSignalService, PinManagerService, SeriesIndexFetcher, SortAndFilterService, TaskManager, TranslationService } from '../Services';


import de from '../translations/de.json';
import en from '../translations/en.json';
import { IModule } from './IModule';

export const CoreModule: IModule = (app) => {
	app.register(MemoryKeyValueStore, IKeyValueStoreSymbol);
	app.register(ObjectStore, IObjectStoreSymbol);

	app.register(TaskManager, ITaskManagerSymbol);
	app.register(LogService, ILogServiceSymbol);
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
