import { ReadonlySignal } from '@preact/signals-core';

export interface IDialogOptions {
	title?: ReadonlySignal<string>;
	okButtonText?: ReadonlySignal<string>;
	cancelButtonText?: ReadonlySignal<string>;
}
