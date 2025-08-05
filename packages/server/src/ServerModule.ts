import type { IModule } from 'ipmc-core';
import { IPinServiceSymbol, PinService } from './services/PinService';

export const ServerModule: IModule = (app) => {
	app.register(PinService, IPinServiceSymbol);
};
