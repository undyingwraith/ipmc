import { Signal } from '@preact/signals-core';
import { injectable } from 'inversify';
import { ITask, ITaskManager, ITaskStatus } from 'ipmc-interfaces';
import { uuid } from '../util';

@injectable()
export class TaskManager implements ITaskManager {
	public status: Signal<ITaskStatus[]> = new Signal<ITaskStatus[]>([]);

	public runTask(task: ITask): void {
		const status: ITaskStatus = {
			id: uuid(),
			title: task.title,
		};
		this.status.value = [...this.status.value, status];
		task.task((progress, total) => {
			this.status.value = this.status.value.map(t => t.id === status.id ? ({ ...t, progress, total }) : t);
		})
			.finally(() => {
				this.status.value = this.status.value.filter(s => s.id !== status.id);
			});
	}
}
