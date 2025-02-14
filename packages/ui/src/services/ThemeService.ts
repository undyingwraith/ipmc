import { computed, Signal } from '@preact/signals';
import { createDarkTheme, createLightTheme } from '../Theme';

export const ThemeServiceSymbol = Symbol.for('ThemeService');

export class ThemeService {
	public accentColor = new Signal('#6200EE');
	public darkMode = new Signal(true);
	public theme = computed(() => this.darkMode.value ? createDarkTheme(this.accentColor.value) : createLightTheme(this.accentColor.value));
}
