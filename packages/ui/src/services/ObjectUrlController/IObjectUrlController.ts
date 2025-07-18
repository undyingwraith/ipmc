export const IObjectUrlControllerSymbol = Symbol.for('IObjectUrlController');

export interface IObjectUrlController {
	getObjectUrl(cid: String, onProgress?: (progress: bigint) => void): [Promise<string>, () => void];
}
