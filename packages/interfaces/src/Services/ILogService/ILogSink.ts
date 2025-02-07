import { ILogMessage } from './ILogMessage';

export const ILogSinkSymbol = Symbol.for('ILogSink');

/**
 * A log sink to write the messages to.
 */
export interface ILogSink {
	/**
	 * Write a message to the sink.
	 * @param msg the message to write to the sink.
	 */
	write(msg: ILogMessage): void;
}
