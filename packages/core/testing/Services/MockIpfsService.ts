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
		throw new Error('Method not implemented.');
	}

	peers(): Promise<string[]> {
		throw new Error('Method not implemented.');
	}

	stop(): Promise<void> {
		return Promise.resolve();
	}

	resolve(ipns: string): Promise<string> {
		throw new Error('Method not implemented.');
	}

	id(): string {
		return 'TestId';
	}

	fetch(cid: string, path?: string): Promise<Uint8Array> {
		throw new Error('Method not implemented.');
	}

	private pins: string[] = [];
}
