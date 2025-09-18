import { IModule } from 'ipmc-core';
import { IDialogServiceSymbol, ILogSinkSymbol, IPopupServiceSymbol } from 'ipmc-interfaces';
import { AppbarButtonService, AppbarButtonServiceSymbol } from './AppbarButtonService';
import { ConsoleLogSink } from './ConsoleLogSink';
import { DialogService } from './DialogService';
import { PopupService } from './PopupService';
import { IFilterSymbol, ISortAndFilterServiceSymbol, SortAndFilterService, YearFilter } from './SortAndFilterService';
import { ThemeService, ThemeServiceSymbol } from './ThemeService';

export const UiCoreModule: IModule = (app) => {
	app.register(PopupService, IPopupServiceSymbol);
	app.register(DialogService, IDialogServiceSymbol);
	app.register(ThemeService, ThemeServiceSymbol);
	app.register(AppbarButtonService, AppbarButtonServiceSymbol);
	app.registerMultiple(YearFilter, IFilterSymbol);
	app.register(SortAndFilterService, ISortAndFilterServiceSymbol);
	app.registerMultiple(ConsoleLogSink, ILogSinkSymbol);
};
