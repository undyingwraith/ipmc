import { ITask } from './ITask';
import { ITaskStatus } from './ITaskStatus';
import { Signal } from '@preact/signals-core';

export const ITaskManagerSymbol = Symbol.for('ITaskManager');

/**
 * A Manager for long running {@link ITask}'s.
 */
export interface ITaskManager {
	/**
	 * Instantly runs a long running {@link ITask}.
	 * @param task Task to execute.
	 */
	runTask(task: ITask): void;

	/**
	 * Current status of running {@link ITask}'s.
	 */
	status: Signal<ITaskStatus[]>;
}
