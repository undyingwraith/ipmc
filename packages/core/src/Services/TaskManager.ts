import { Signal } from '@preact/signals-core';
import { inject, injectable } from 'inversify';
import { ILogService, ILogServiceSymbol, ITask, ITaskManager, ITaskStatus } from 'ipmc-interfaces';
import { uuid } from '../util';

@injectable()
export class TaskManager implements ITaskManager {
	constructor(
		@inject(ILogServiceSymbol) private readonly log: ILogService
	) { }

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
			.then(() => {
				return task.onEnd ? task.onEnd() : Promise.resolve();
			})
			.catch(ex => {
				this.log.error(ex);
				return task.onEnd ? task.onEnd(ex) : Promise.resolve();
			})
			.finally(() => {
				this.status.value = this.status.value.filter(s => s.id !== status.id);
			});
	}
}
