import { IModule } from 'ipmc-core';
import { IDialogServiceSymbol, ILogSinkSymbol, IPopupServiceSymbol } from 'ipmc-interfaces';
import { DialogService } from './DialogService';
import { PopupService } from './PopupService';
import { ThemeService, ThemeServiceSymbol } from './ThemeService';
import { AppbarButtonService, AppbarButtonServiceSymbol } from './AppbarButtonService';
import { IMediaPlayerServiceSymbol, MediaPlayerService } from './MediaPlayerService';
import { ConsoleLogSink } from './ConsoleLogSink';

export const UiModule: IModule = (app) => {
	app.register(PopupService, IPopupServiceSymbol);
	app.register(DialogService, IDialogServiceSymbol);
	app.register(ThemeService, ThemeServiceSymbol);
	app.register(AppbarButtonService, AppbarButtonServiceSymbol);
	app.registerMultiple(ConsoleLogSink, ILogSinkSymbol);
	app.register(MediaPlayerService, IMediaPlayerServiceSymbol);
};
