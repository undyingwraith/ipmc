import { useSignalEffect } from '@preact/signals-react';


export interface IHotkey {
	key: string;
	shift?: boolean;
	alt?: boolean;
	ctrl?: boolean;
}

export function useHotkey(hotkey: IHotkey, action: () => void) {
	useSignalEffect(() => {
		function listener(ev: KeyboardEvent) {
			if (
				ev.key.toLowerCase() == hotkey.key.toLowerCase()
				&& (hotkey.ctrl ? ev.ctrlKey : true)
				&& (hotkey.alt ? ev.altKey : true)
				&& (hotkey.shift ? ev.shiftKey : true)
			) {
				ev.preventDefault();
				action();
			}
		}

		window.addEventListener('keydown', listener);

		return () => {
			window.removeEventListener('keydown', listener);
		};
	});
}
