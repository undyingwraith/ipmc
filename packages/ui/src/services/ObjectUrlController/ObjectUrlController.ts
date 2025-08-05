import { fileTypeFromBuffer } from 'file-type';
import { inject, injectable } from 'inversify';
import { IIpfsServiceSymbol, type IIpfsService } from 'ipmc-interfaces';

@injectable()
export class ObjectUrlController {
	constructor(
		@inject(IIpfsServiceSymbol) private readonly ipfs: IIpfsService,
	) { }

	public getObjectUrl(cid: string, onProgress?: (progress: bigint) => void): [Promise<string>, () => void] {
		if (!this.cidMap.has(cid)) {
			const controller = new MultiAbortController();

			controller.signal.addEventListener('abort', () => {
				if (this.cidMap.has(cid)) {
					const { promise } = this.cidMap.get(cid)!;
					this.cidMap.delete(cid);
					promise.then((r) => {
						URL.revokeObjectURL(r);
					});
				}
			});

			const fetch = async () => {
				const data = await this.ipfs.fetch(cid);
				const fileType = await fileTypeFromBuffer(data);
				if (!fileType) {
					throw new Error('Failed to detect fileType');
				}
				const blob = new Blob([data], {
					type: fileType.mime,
				});
				controller.signal.throwIfAborted();
				return URL.createObjectURL(blob);
			};

			this.cidMap.set(cid, {
				promise: fetch(),
				controller,
			});
		};


		const r = this.cidMap.get(cid)!;
		return [r.promise, r.controller.getAborter()];
	}

	private readonly cidMap = new Map<string, { promise: Promise<string>; controller: MultiAbortController; }>();
}

class MultiAbortController {
	getAborter(): () => void {
		const sym = Symbol();
		this.listeners.push(sym);
		return () => {
			this.listeners = this.listeners.filter(s => s !== sym);
			if (this.listeners.length === 0) {
				setTimeout(() => {
					if (this.listeners.length === 0) {
						this.controller.abort();
					}
				}, 500);
			}
		};
	}

	get signal() {
		return this.controller.signal;
	}

	private listeners: Symbol[] = [];
	private controller = new AbortController();
}
