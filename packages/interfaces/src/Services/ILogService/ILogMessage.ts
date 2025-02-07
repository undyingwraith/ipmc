/**
 * Contains various bits of a log entry.
 */
export interface ILogMessage {
	/**
	 * The message of the log entry.
	 */
	message: string;

	/**
	 * The time of the log entry.
	 */
	time: Date;

	/**
	 * The selected log level.
	 */
	level: TLogLevel;

	/**
	 * Attached error if any.
	 */
	error?: Error;
}

export type TLogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
