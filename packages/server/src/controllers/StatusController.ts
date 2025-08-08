import express from "express";
import { inject } from 'inversify';
import { controller, httpGet, response } from "inversify-express-utils";
import { IIpfsServiceSymbol, type IIpfsService } from 'ipmc-interfaces';

@controller('/status')
export class StatusController {
	constructor(@inject(IIpfsServiceSymbol) private readonly ipfs: IIpfsService) { }

	/**
	 * @swagger
	 * /status:
	 *  get:
	 *   summary: Gets the status of the server.
	 *   tags: [Status]
	 *   responses:
	 *    200:
	 *     description: OK
	 */
	@httpGet('/')
	status(@response() res: express.Response): void {
		res.sendStatus(200);
	}

	/**
	 * @swagger
	 * /status/id:
	 *  get:
	 *   summary: Gets the id of the server node.
	 *   tags: [Status]
	 *   responses:
	 *    200:
	 *     description: Id of the server node.
	 *     content:
	 *      text/plain:
	 *       example: 12D3KooWHmSSfatK5oPiUYxW9pT4P9TCQAVCReZhhsnYVRvjRK5f
	 */
	@httpGet('/id')
	id(@response() res: express.Response): void {
		res.send(this.ipfs.id());
	}

	/**
	 * @swagger
	 * /status/peers:
	 *  get:
	 *   summary: Gets the peers connected to the server node.
	 *   tags: [Status]
	 *   responses:
	 *    200:
	 *     description: Peers connected to the server node.
	 *     content:
	 *      application/json:
	 *       schema:
	 *        type: array
	 *        items:
	 *         type: string
	 *         description: Adress of connected node.
	 *         example: /ip4/127.0.0.1/tcp/4001/p2p/12D3KooWHmSSfatK5oPiUYxW9pT4P9TCQAVCReZhhsnYVRvjRK5f
	 */
	@httpGet('/peers')
	async peers(@response() res: express.Response): Promise<void> {
		res.json(await this.ipfs.peers());
	}
}
