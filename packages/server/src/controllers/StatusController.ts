import * as express from "express";
import { inject } from 'inversify';
import { controller, httpGet, request, response } from "inversify-express-utils";
import { IIpfsServiceSymbol, type IIpfsService } from 'ipmc-interfaces';

@controller('/status')
export class StatusController {
	constructor(@inject(IIpfsServiceSymbol) private readonly ipfs: IIpfsService) { }

	@httpGet('/')
	private status(@request() req: express.Request, @response() res: express.Response): void {
		res.sendStatus(200);
	}

	@httpGet('/id')
	private id(@response() res: express.Response): void {
		res.json(this.ipfs.id());
	}

	@httpGet('/peers')
	private async peers(@response() res: express.Response): Promise<void> {
		res.json(await this.ipfs.peers());
	}
}
