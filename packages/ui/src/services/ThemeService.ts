import { computed, Signal } from '@preact/signals-react';
import { inject, injectable, optional } from 'inversify';
import { type IPersistentSignalService, IPersistentSignalServiceSymbol } from 'ipmc-interfaces';
import { createDarkTheme, createLightTheme } from '../Theme';

export const ThemeServiceSymbol = Symbol.for('ThemeService');

export const IThemeServiceConfigSymbol = Symbol.for('IThemeServiceConfig');

export interface IThemeServiceConfig {
	accentColor: string;
	darkMode: boolean;
}

@injectable()
export class ThemeService {
	constructor(
		@inject(IPersistentSignalServiceSymbol) signalService: IPersistentSignalService,
		@inject(IThemeServiceConfigSymbol) @optional() config?: Partial<IThemeServiceConfig>,
	) {
		this.accentColor = signalService.get('accentColor', config?.accentColor ?? '#6200EE');
		this.darkMode = signalService.get('darkMode', config?.darkMode ?? true);
	}

	public accentColor: Signal<string>;
	public darkMode: Signal<boolean>;
	public theme = computed(() => this.darkMode.value ? createDarkTheme(this.accentColor.value) : createLightTheme(this.accentColor.value));
}
