import { IIndexManagerSymbol, IPinManagerServiceSymbol, ISortAndFilterServiceSymbol } from 'ipmc-interfaces';
import { GlobalSearchService, IGlobalSearchServiceSymbol, IIndexFetcherSymbol, IndexManager, IVersionServiceSymbol, MovieIndexFetcher, PinManagerService, SeriesIndexFetcher, SortAndFilterService, VersionService } from '../Services';
import { IModule } from './IModule';

export const ProfileModule: IModule = (app) => {
	app.register(VersionService, IVersionServiceSymbol);
	app.register(IndexManager, IIndexManagerSymbol);
	app.register(GlobalSearchService, IGlobalSearchServiceSymbol);
	app.register(PinManagerService, IPinManagerServiceSymbol);
	app.register(SortAndFilterService, ISortAndFilterServiceSymbol);
	app.registerMultiple(MovieIndexFetcher, IIndexFetcherSymbol);
	app.registerMultiple(SeriesIndexFetcher, IIndexFetcherSymbol);
};
