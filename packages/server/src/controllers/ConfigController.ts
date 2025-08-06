import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { IProfileServiceSymbol, type IProfileService } from '../services';

/**
 * @swagger
 * components:
 *  schemas:
 *   ClientConfig:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *     name:
 *      type: string
 *     type:
 *      type: string
 *      example: internal
 *     bootstrap:
 *      type: array
 *      items:
 *       type: string
 *     libraries:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/Library'
 *   Config:
 *    allOf:
 *     - $ref: '#/components/schemas/ClientConfig'
 *     - type: object
 *       properties:
 *        apiPort:
 *         type: number
 *         example: 3000
 *   Library:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 */
@controller('/config')
export class ConfigController {
	constructor(
		@inject(IProfileServiceSymbol) private readonly profileService: IProfileService,
	) { }

	/**
	 * @swagger
	 * /config:
	 *  get:
	 *   summary: Gets the config of the server.
	 *   responses:
	 *    200:
	 *     content:
	 *      application/json:
	 *       schema:
	 *        $ref: '#/components/schemas/Config'
	 */
	@httpGet('/')
	getConfig(@response() res: express.Response): void {
		res.json(this.profileService.profile);
	}

	/**
	 * @swagger
	 * /config/client:
	 *  get:
	 *   summary: Gets the config of the server trimmed for a client.
	 *   responses:
	 *    200:
	 *     content:
	 *      application/json:
	 *       schema:
	 *        $ref: '#/components/schemas/ClientConfig'
	 */
	@httpGet('/client')
	getClientConfig(@response() res: express.Response): void {
		res.json(this.profileService.clientProfile);
	}

	/**
	 * @swagger
	 * /config:
	 *  post:
	 *   summary: Sets the config of the server.
	 *   requestBody:
	 *    required: true
	 *    content:
	 *     application/json:
	 *      schema:
	 *       $ref: '#/components/schemas/Config'
	 *   response:
	 *    200:
	 *     application/json:
	 *      schema:
	 *       $ref: '#/components/schemas/Config'
	 */
	@httpPost('/')
	setConfig(@request() req: express.Request, @response() res: express.Response): void {
		this.profileService.updateProfile(req.body);
		res.json(this.profileService.profile);
	}
}
