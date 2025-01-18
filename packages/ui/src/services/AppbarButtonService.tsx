import { Box } from '@mui/material';
import { computed, Signal } from '@preact/signals-react';
import React from 'react';

export interface IAppbarButtonOptions {
	position: 'start' | 'end';
	component: any;
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

	public appbarButtons = computed(() => (<>
		{this.buttons.value.filter(b => b.position === 'start').map(b => b.component)}
		<Box sx={{ flexGrow: 1 }} />
		{this.buttons.value.filter(b => b.position === 'end').map(b => b.component)}
	</>));

	private buttons = new Signal<(IAppbarButtonOptions & { id: Symbol; })[]>([]);
}
