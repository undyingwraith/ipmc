import { Application, CoreModule } from 'ipmc-core';
import { IIpfsServiceSymbol, ILogService, ILogServiceSymbol } from 'ipmc-interfaces';
import { createNode } from './createNode';
import { ServerModule } from './ServerModule';
import { /*IPinServiceSymbol,*/ IProfileServiceSymbol, /*type IPinService,*/ type IProfileService } from './services';

// Register services
const app = new Application();
app.use(CoreModule);
app.use(ServerModule);

// Start node
const profileService = app.getService<IProfileService>(IProfileServiceSymbol)!;
const heliaService = await createNode(profileService.profile);
app.registerConstant(heliaService, IIpfsServiceSymbol);

// Log server start
const log = app.getService<ILogService>(ILogServiceSymbol)!;
log.info('Server started!');

// Start background services
//app.getService<IPinService>(IPinServiceSymbol)!;
