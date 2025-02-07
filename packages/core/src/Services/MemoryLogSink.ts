import { injectable } from 'inversify';
import { ILogMessage, ILogSink } from 'ipmc-interfaces';

@injectable()
export class MemoryLogSink implements ILogSink {
	public write(msg: ILogMessage): void {
		this.logs.push(msg);
	}

	public logs: ILogMessage[] = [];
}
