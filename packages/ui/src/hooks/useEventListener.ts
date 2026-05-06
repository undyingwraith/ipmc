import { ReadonlySignal, useSignalEffect } from '@preact/signals-react';

export function useEventListener<TEvent extends Event>(target: HTMLElement | Document | ReadonlySignal<HTMLElement | null>, event: string, handler: (ev: TEvent) => void) {
	useSignalEffect(() => {
		let tgt: HTMLElement | undefined;
		if (target instanceof HTMLElement) {
			tgt = target;
		} else if (target instanceof Document) {
			tgt = target.body;
		} else if (target.value) {
			tgt = target.value;
		}

		if (tgt) {
			tgt.addEventListener(event, handler);

			return () => {
				tgt.removeEventListener(event, handler);
			};
		} else {
			return () => { };
		}
	});
}
