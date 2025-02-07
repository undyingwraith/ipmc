import { injectable } from 'inversify';
import { ILogMessage, ILogSink } from 'ipmc-interfaces';

@injectable()
export class ConsoleLogSink implements ILogSink {
	write(msg: ILogMessage): void {
		console.log(`[${msg.time.toISOString()}][${msg.level}]: ${msg.message}`, msg.error);
	}
}
