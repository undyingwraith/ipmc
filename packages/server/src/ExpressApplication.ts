import * as bodyParser from 'body-parser';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Application } from 'ipmc-core';
import { IProfileSymbol } from 'ipmc-interfaces';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { DefaultServerProfile } from './DefaultServerProfile';
import type { IExpressApplication } from './IExpressApplication';
import type { IServerProfile } from './IServerProfile';

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

			// Setup swagger api docs
			const swaggerDefinition = {
				openapi: '3.0.0',
				info: {
					title: 'API for IPMC server',
					version: '0.0.0',
				},
			};

			const options = {
				swaggerDefinition,
				// Paths to files containing OpenAPI definitions
				apis: ['./src/controllers/*.ts'],
			};

			const swaggerSpec = swaggerJSDoc(options);
			app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
