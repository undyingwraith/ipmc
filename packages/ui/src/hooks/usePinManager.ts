import { ReadonlySignal, useSignal } from '@preact/signals';
import { HasPinAbility, ILogService, ILogServiceSymbol, IPinManagerService, IPinManagerServiceSymbol, PinStatus } from 'ipmc-interfaces';
import { useService } from '../context/AppContext';

export function usePinManager(item: HasPinAbility): [ReadonlySignal<PinStatus>, setState: (pin: boolean) => void] {
	const pinManager = useService<IPinManagerService>(IPinManagerServiceSymbol);
	const log = useService<ILogService>(ILogServiceSymbol);
	const status = useSignal<PinStatus>(pinManager.isPinned(item));

	function setState(pin: boolean) {
		if (status.value == PinStatus.Pinned && !pin) {
			status.value = PinStatus.Working;
			pinManager.removePin(item)
				.then(() => {
					status.value = PinStatus.UnPinned;
				}).catch((ex) => {
					log.error(ex);
					status.value = PinStatus.Pinned;
				});
		} else if (status.value == PinStatus.UnPinned && pin) {
			status.value = PinStatus.Working;
			pinManager.addPin(item)
				.then(() => {
					status.value = PinStatus.Pinned;
				}).catch((ex) => {
					log.error(ex);
					status.value = PinStatus.UnPinned;
				});
		}
	}

	return [status, setState];
}
