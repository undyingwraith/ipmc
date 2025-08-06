import type { IModule } from 'ipmc-core';
import { ILogSinkSymbol } from 'ipmc-interfaces';
import { ConsoleLogSink, IPinServiceSymbol, IProfileServiceSymbol, PinService, ProfileService } from './services';

export const ServerModule: IModule = (app) => {
	app.register(PinService, IPinServiceSymbol);
	app.register(ProfileService, IProfileServiceSymbol);
	app.registerMultiple(ConsoleLogSink, ILogSinkSymbol);
};
