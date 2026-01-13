import { IModule, IVersionServiceSymbol, VersionService } from 'ipmc-core';
import { IDialogServiceSymbol, ILogSinkSymbol, IPopupServiceSymbol } from 'ipmc-interfaces';
import { ConsoleLogSink } from './ConsoleLogSink';
import { DialogService } from './DialogService';
import { PopupService } from './PopupService';
import { ThemeService, ThemeServiceSymbol } from './ThemeService';

export const UiCoreModule: IModule = (app) => {
	app.register(PopupService, IPopupServiceSymbol);
	app.register(DialogService, IDialogServiceSymbol);
	app.register(ThemeService, ThemeServiceSymbol);
	app.registerMultiple(ConsoleLogSink, ILogSinkSymbol);
	app.register(VersionService, IVersionServiceSymbol);
};
