import { CoreModule } from 'ipmc-core';
import { IIpfsServiceSymbol, ILogService, ILogServiceSymbol } from 'ipmc-interfaces';
import './controllers';
import { createNode } from './createNode';
import { ExpressApplication } from './ExpressApplication';
import { ServerModule } from './ServerModule';
import { IPinServiceSymbol, IProfileServiceSymbol, type IPinService, type IProfileService } from './services';

// Register services
const app = new ExpressApplication();
app.use(CoreModule);
app.use(ServerModule);

// Start node
const profileService = app.getService<IProfileService>(IProfileServiceSymbol)!;
const heliaService = await createNode(profileService.profile);
app.registerConstant(heliaService, IIpfsServiceSymbol);
await app.start();

// Log server start
const log = app.getService<ILogService>(ILogServiceSymbol)!;
log.info('Server started!');

// Start background services
app.getService<IPinService>(IPinServiceSymbol)!;
