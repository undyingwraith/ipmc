import { computed, Signal } from '@preact/signals-react';
import { inject, injectable } from 'inversify';
import { type IPersistentSignalService, IPersistentSignalServiceSymbol } from 'ipmc-interfaces';
import { createDarkTheme, createLightTheme } from '../Theme';

export const ThemeServiceSymbol = Symbol.for('ThemeService');

@injectable()
export class ThemeService {
	constructor(
		@inject(IPersistentSignalServiceSymbol) signalService: IPersistentSignalService,
	) {
		this.accentColor = signalService.get('accentColor', '#6200EE');
		this.darkMode = signalService.get('darkMode', true);
	}

	public accentColor: Signal<string>;
	public darkMode: Signal<boolean>;
	public theme = computed(() => this.darkMode.value ? createDarkTheme(this.accentColor.value) : createLightTheme(this.accentColor.value));
}
