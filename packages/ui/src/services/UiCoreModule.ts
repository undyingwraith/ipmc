import { IModule } from 'ipmc-core';
import { IDialogServiceSymbol, ILogSinkSymbol, IPopupServiceSymbol } from 'ipmc-interfaces';
import { AppbarButtonService, AppbarButtonServiceSymbol } from './AppbarButtonService';
import { ConsoleLogSink } from './ConsoleLogSink';
import { DialogService } from './DialogService';
import { ILibraryNavigationServiceSymbol, LibraryNavigationService } from './LibraryNavigationService';
import { INavigationServiceSymbol, NavigationService } from './NavigationService';
import { PopupService } from './PopupService';
import { ThemeService, ThemeServiceSymbol } from './ThemeService';

export const UiCoreModule: IModule = (app) => {
	app.register(PopupService, IPopupServiceSymbol);
	app.register(DialogService, IDialogServiceSymbol);
	app.register(ThemeService, ThemeServiceSymbol);
	app.register(AppbarButtonService, AppbarButtonServiceSymbol);
	app.register(LibraryNavigationService, ILibraryNavigationServiceSymbol);
	app.register(NavigationService, INavigationServiceSymbol);
	app.registerMultiple(ConsoleLogSink, ILogSinkSymbol);
};
