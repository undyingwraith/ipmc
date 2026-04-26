import { IIndexManagerSymbol, IPinManagerServiceSymbol, ISortAndFilterServiceSymbol } from 'ipmc-interfaces';
import { CommunicationService, GlobalSearchService, ICommunicationServiceSymbol, IGlobalSearchServiceSymbol, IIndexFetcherSymbol, IndexManager, MovieIndexFetcher, PinManagerService, SeriesIndexFetcher, SortAndFilterService } from '../Services';
import { IModule } from './IModule';

export const ProfileModule: IModule = (app) => {
	app.register(IndexManager, IIndexManagerSymbol);
	app.register(GlobalSearchService, IGlobalSearchServiceSymbol);
	app.register(PinManagerService, IPinManagerServiceSymbol);
	app.register(SortAndFilterService, ISortAndFilterServiceSymbol);
	app.registerMultiple(MovieIndexFetcher, IIndexFetcherSymbol);
	app.registerMultiple(SeriesIndexFetcher, IIndexFetcherSymbol);
	app.register(CommunicationService, ICommunicationServiceSymbol);
};
