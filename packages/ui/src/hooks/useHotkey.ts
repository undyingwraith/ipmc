import { useSignalEffect } from '@preact/signals';
import { IHotkey, IHotkeyService, IHotkeyServiceSymbol } from 'ipmc-interfaces';
import { useService } from '../context/AppContext';

export function useHotkey(hotkey: IHotkey, action: () => void) {
	const hotkeyService = useService<IHotkeyService>(IHotkeyServiceSymbol);

	useSignalEffect(() => {
		const sym = hotkeyService.registerHotkey(hotkey, action);

		return () => {
			hotkeyService.removeHotkey(sym);
		};
	});
}
