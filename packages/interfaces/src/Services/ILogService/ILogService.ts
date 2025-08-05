export const ILogServiceSymbol = Symbol.for('ILogService');

/**
 * A service to write logs.
 */
export interface ILogService {
	/**
	 * Writes a trace message to the log.
	 * @param msg message to write.
	 */
	trace(msg: string): void;

	/**
	 * Writes a debug message to the log.
	 * @param msg message to write.
	 */
	debug(msg: string): void;

	/**
	 * Writes a info message to the log.
	 * @param msg message to write.
	 */
	info(msg: string): void;

	/**
	 * Writes a warning message to the log.
	 * @param msg message to write.
	 */
	warn(msg: string): void;

	/**
	 * Writes a error message to the log.
	 * @param msg message to write.
	 */
	error(msg: Error | string): void;
}
