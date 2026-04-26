import { Application, CoreModule, ICommunicationService, ICommunicationServiceSymbol, ProfileModule } from 'ipmc-core';
import { IIpfsServiceSymbol, ILogService, ILogServiceSymbol, IProfileSymbol } from 'ipmc-interfaces';
import { createNode } from './createNode';
import { ServerModule } from './ServerModule';
import { IProfileServiceSymbol, type IProfileService } from './services';

// Register services
const app = new Application();
app.use(CoreModule);
app.use(ProfileModule);
app.use(ServerModule);

// Start node
const profileService = app.getService<IProfileService>(IProfileServiceSymbol)!;
app.registerConstant(profileService.clientProfile, IProfileSymbol);
const heliaService = await createNode(profileService.profile);
app.registerConstant(heliaService, IIpfsServiceSymbol);

// Log server start
const log = app.getService<ILogService>(ILogServiceSymbol)!;
log.info('Server started!');

// Start background services
app.getService<ICommunicationService>(ICommunicationServiceSymbol)!;
