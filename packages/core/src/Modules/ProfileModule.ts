import { IIndexManagerSymbol, IPinManagerServiceSymbol } from 'ipmc-interfaces';
import { IIndexFetcherSymbol, IndexManager, MovieIndexFetcher, PinManagerService, SeriesIndexFetcher } from '../Services';
import { IModule } from './IModule';

export const ProfileModule: IModule = (app) => {
	app.register(IndexManager, IIndexManagerSymbol);
	app.register(PinManagerService, IPinManagerServiceSymbol);
	app.register(IndexManager, IIndexManagerSymbol);
	app.registerMultiple(MovieIndexFetcher, IIndexFetcherSymbol);
	app.registerMultiple(SeriesIndexFetcher, IIndexFetcherSymbol);
};
