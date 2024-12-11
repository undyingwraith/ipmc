/**
 * A long running task.
 */
export interface ITask {
	title: string;

	/**
	 * The task to run.
	 */
	task: (onProgress: (progress: number) => void) => Promise<void>;

	/**
	 * Start event handler.
	 */
	onStart?: () => void | Promise<void>;

	/**
	 * End event handler.
	 */
	onEnd?: () => void | Promise<void>;
}
