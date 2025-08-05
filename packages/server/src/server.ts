import fs from 'fs';
import { CoreModule } from 'ipmc-core';
import { IIpfsServiceSymbol, IProfileSymbol } from 'ipmc-interfaces';
import './controllers';
import { createNode } from './createNode';
import { ExpressApplication } from './ExpressApplication';
import type { IServerProfile } from './IServerProfile';
import { ServerModule } from './ServerModule';

// Check for profile file
if (!fs.statSync('./profile.json').isFile()) {
	throw new Error('No profile.json found!');
}

const profile: IServerProfile = JSON.parse(fs.readFileSync('./profile.json', 'utf-8'));
const heliaService = await createNode(profile);

const app = new ExpressApplication();
app.use(CoreModule);
app.use(ServerModule);
app.registerConstant(heliaService, IIpfsServiceSymbol);
app.registerConstant(profile, IProfileSymbol);
app.start();
