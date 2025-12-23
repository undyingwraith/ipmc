import { IFileInfo, IIpfsService } from 'ipmc-interfaces';

export class MockIpfsService implements IIpfsService {
	isPinned(cid: string): Promise<boolean> {
		return Promise.resolve(this.pins.some(p => p === cid));
	}

	addPin(cid: string): Promise<void> {
		this.pins.push(cid);
		return Promise.resolve();
	}

	rmPin(cid: string): Promise<void> {
		this.pins = this.pins.filter(p => p !== cid);
		return Promise.resolve();
	}

	ls(cid: string): Promise<IFileInfo[]> {
		if (this.cids[cid] && Array.isArray(this.cids[cid])) {
			return Promise.resolve(this.cids[cid]);
		}

		throw new Error(`NotFound: '${cid}'`);
	}

	peers(): Promise<{ peer: string, addrs: string[]; }[]> {
		throw new Error('Method not implemented.');
	}

	stop(): Promise<void> {
		return Promise.resolve();
	}

	resolve(ipns: string): Promise<string> {
		if (this.ipns[ipns]) {
			return Promise.resolve(this.ipns[ipns]);
		}

		throw new Error(`NotFound: '${ipns}'`);
	}

	id(): string {
		return 'TestId';
	}

	fetch(cid: string): Promise<Uint8Array<ArrayBuffer>> {
		if (this.cids[cid] && !Array.isArray(this.cids[cid])) {
			return Promise.resolve(this.cids[cid]);
		}

		throw new Error(`NotFound: '${cid}'`);
	}

	cids: { [key: string]: IFileInfo[] | Uint8Array<ArrayBuffer>; } = {};
	ipns: { [key: string]: string; } = {};

	private pins: string[] = [];
}
