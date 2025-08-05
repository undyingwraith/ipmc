/**
 * Represents the status of an {@link ITask}
 */
export interface ITaskStatus {
	/**
	 * Progress of the {@link ITask} (if available).
	 */
	progress?: number;

	/**
	 * Total progress of the {@link ITask} (if available).
	 */
	total?: number;

	/**
	 * Title of the {@link ITask}.
	 */
	title: string;

	/**
	 * Id of the {@link ITask}.
	 */
	id: string;
}
