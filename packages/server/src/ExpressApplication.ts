import * as bodyParser from 'body-parser';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Application } from 'ipmc-core';
import { IProfileSymbol } from 'ipmc-interfaces';
import type { IExpressApplication } from './IExpressApplication';
import type { IServerProfile } from './IServerProfile';
import { DefaultServerProfile } from './DefaultServerProfile';

export class ExpressApplication extends Application implements IExpressApplication {
	public constructor() {
		super();
		this.server = new InversifyExpressServer(this.container);
		this.server.setConfig((app) => {
			// add body parser
			app.use(bodyParser.urlencoded({
				extended: true
			}));
			app.use(bodyParser.json());
		});
	}

	public async start() {
		const profile = this.container.get<IServerProfile>(IProfileSymbol);
		this.server
			.build()
			.listen(profile.apiPort ?? DefaultServerProfile.apiPort!);
	}

	private server: InversifyExpressServer;
}
