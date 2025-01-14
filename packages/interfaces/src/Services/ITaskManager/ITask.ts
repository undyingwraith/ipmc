/**
 * A long running task.
 */
export interface ITask {
	title: string;

	/**
	 * The task to run.
	 */
	task: (onProgress: IOnProgress) => Promise<void>;

	/**
	 * Start event handler.
	 */
	onStart?: () => void | Promise<void>;

	/**
	 * End event handler.
	 */
	onEnd?: () => void | Promise<void>;
}

export type IOnProgress = (progress: number, total?: number) => void;
