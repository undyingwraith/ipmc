import { ReadonlySignal, useSignal, useSignalEffect } from '@preact/signals-react';
import { useProfile } from '../components/pages/ProfileContext';

export enum PinStatus {
	Unknown,
	UnPinned,
	Pinned,
	Pinning,
	UnPinning,
}

export function usePinManager(cid: string): [ReadonlySignal<PinStatus>, setState: (pin: boolean) => void] {
	const { ipfs } = useProfile();
	const status = useSignal<PinStatus>(PinStatus.Unknown);

	function setState(pin: boolean) {
		if (status.value == PinStatus.Pinned && !pin) {
			status.value = PinStatus.UnPinning;
			ipfs.rmPin(cid)
				.then(() => {
					status.value = PinStatus.UnPinned;
				}).catch((ex) => {
					console.error(ex);
					status.value = PinStatus.Pinned;
				});
		} else if (status.value == PinStatus.UnPinned && pin) {
			status.value = PinStatus.Pinning;
			ipfs.addPin(cid)
				.then(() => {
					status.value = PinStatus.Pinned;
				}).catch((ex) => {
					console.error(ex);
					status.value = PinStatus.UnPinned;
				});
		}
	}

	useSignalEffect(() => {
		ipfs.isPinned(cid)
			.then(r => {
				status.value = r ? PinStatus.Pinned : PinStatus.UnPinned;
			});
	});

	return [status, setState];
}
