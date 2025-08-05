import { computed, Signal } from '@preact/signals-react';

export interface IAppbarButtonOptions {
	position: 'start' | 'end';
	component: any;
	sortIndex?: number;
}

export const AppbarButtonServiceSymbol = Symbol.for('AppbarButtonService');

export class AppbarButtonService {
	public registerAppbarButton(options: IAppbarButtonOptions): Symbol {
		const id = Symbol();
		this.buttons.value = [...this.buttons.value, { ...options, id }];
		return id;
	}

	public unRegisterAppbarButton(id: Symbol): void {
		this.buttons.value = this.buttons.value.filter((b) => b.id !== id);
	}

	public startButtons = computed(() => this.transform(this.buttons.value, 'start'));
	public endButtons = computed(() => this.transform(this.buttons.value, 'end'));

	private transform(items: IAppbarButtonOptions[], position: 'start' | 'end') {
		return items.filter(b => b.position === position).sort((a, b) => (a.sortIndex ?? 1) - (b.sortIndex ?? 1)).map(b => b.component);
	}

	private buttons = new Signal<(IAppbarButtonOptions & { id: Symbol; })[]>([]);
}
