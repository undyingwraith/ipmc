import { inject } from 'inversify';
import express from 'express';
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils';
import { IProfileServiceSymbol, IProfileService } from '../services';
import { uuid } from 'ipmc-core';

/**
 * @swagger
 * components:
 *  schemas:
 *   Library:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *     id:
 *      type: string
 *     upstream:
 *      type: string
 *     type:
 *      type: string
 *      enum: [music, movie, series]
 *   ServerLibrary:
 *    allOf:
 *     - $ref: '#/components/schemas/Library'
 *     - type: object
 *       properties:
 *        keepPinned:
 *         type: boolean
 *         description: Sets whether the server should pin the library.
 */
@controller('/library')
export class LibraryController {
	constructor(
		@inject(IProfileServiceSymbol) private readonly profileService: IProfileService,
	) { }

	/**
	 * @swagger
	 * /library:
	 *  get:
	 *   summary: Gets all libraries.
	 *   tags: [Library]
	 *   responses:
	 *    200:
	 *     application/json:
	 *      schema:
	 *       type: array
	 *       items:
	 *        $ref: '#/components/schemas/ServerLibrary'
	 */
	@httpGet('/')
	getAll(@response() res: express.Response) {
		res.status(200).json(this.profileService.profile.libraries);
	}

	/**
	 * @swagger
	 * /library:
	 *  post:
	 *   summary: Adds a new library.
	 *   tags: [Library]
	 *   parameters:
	 *    - in: body
	 *      schema:
	 *       $ref: '#/components/schemas/ServerLibrary'
	 *   responses:
	 *    200:
	 *     description: Added successfuly.
	 *     application/json:
	 *      $ref: '#/components/schemas/ServerLibrary'
	 */
	@httpPost('/')
	add(@request() req: express.Request, @response() res: express.Response) {
		//TODO: validate request body
		const profile = this.profileService.profile;
		this.profileService.updateProfile({
			libraries: [
				...profile.libraries,
				{
					id: uuid(),
					...req.body,
				}
			],
		});
		res.sendStatus(200);
	}

	/**
	 * @swagger
	 * /library/{id}:
	 *  get:
	 *   summary: Gets a specific library.
	 *   tags: [Library]
	 *   parameters:
	 *    - in: path
	 *      name: id
	 *      schema:
	 *       type: string
	 *       required: true
	 *       description: ID of the library.
	 *   responses:
	 *    200:
	 *     description: Data of the library.
	 *     application/json:
	 *      $ref: '#/components/schemas/ServerLibrary'
	 *    404:
	 *     description: Library not found.
	 */
	@httpGet('/:id')
	get(@request() req: express.Request, @response() res: express.Response) {
		const lib = this.profileService.profile.libraries.find(l => l.id === req.params.id);
		if (!lib) {
			res.sendStatus(404);
		} else {
			res.json(lib);
		}
	}

	/**
	 * @swagger
	 * /library/{id}:
	 *  patch:
	 *   summary: Updates a specific library.
	 *   tags: [Library]
	 *   parameters:
	 *    - in: path
	 *      name: id
	 *      schema:
	 *       type: string
	 *       required: true
	 *       description: ID of the library.
	 *    - in: body
	 *      schema:
	 *       $ref: '#/components/schemas/ServerLibrary'
	 *   responses:
	 *    200:
	 *     description: Updated data of the library.
	 *     application/json:
	 *      $ref: '#/components/schemas/ServerLibrary'
	 *    404:
	 *     description: Library not found.
	 */
	@httpPatch('/:id')
	update(@request() req: express.Request, @response() res: express.Response) {
		//TODO: validate request body
		const { id } = req.params;
		const profile = this.profileService.profile;
		if (!profile.libraries.find(l => l.id === id)) {
			res.sendStatus(404);
		} else {
			this.profileService.updateProfile({
				libraries: profile.libraries.map(l => l.id === id ? ({
					...l,
					...req.body,
				}) : l)
			});
			res.sendStatus(200);
		}
		res.sendStatus(501);
	}

	/**
	 * @swagger
	 * /library/{id}:
	 *  delete:
	 *   summary: Deletes a specific library.
	 *   tags: [Library]
	 *   parameters:
	 *    - in: path
	 *      name: id
	 *      schema:
	 *       type: string
	 *       required: true
	 *       description: ID of the library.
	 *   responses:
	 *    200:
	 *     description: Deleted successfuly.
	 *    404:
	 *     description: Library not found.
	 */
	@httpDelete('/:id')
	delete(@request() req: express.Request, @response() res: express.Response) {
		//TODO: validate request body
		const { id } = req.params;
		const profile = this.profileService.profile;
		if (!profile.libraries.find(l => l.id === id)) {
			res.sendStatus(404);
		} else {
			this.profileService.updateProfile({ libraries: profile.libraries.filter(l => l.id === id) });
			res.sendStatus(200);
		}
	}
}
