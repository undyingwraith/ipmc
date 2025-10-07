import { ReadonlySignal, useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { useService } from '../context/AppContext';
import { IObjectUrlController, IObjectUrlControllerSymbol } from '../services';
import { useLinkedSignal } from './useLinkedSignal';

export function useFileUrl(cid?: string, fallback?: string): ReadonlySignal<string | undefined> {
	const result = useSignal<string | undefined>(undefined);
	const objectUrlController = useService<IObjectUrlController>(IObjectUrlControllerSymbol);
	const cidSig = useLinkedSignal(cid);

	useSignalEffect(() => {
		const cid = cidSig.value;
		if (cid !== undefined) {
			const [promise, abort] = objectUrlController.getObjectUrl(cid);
			promise.then(r => {
				result.value = r;
			});

			return () => {
				abort();
			};
		}

		return () => { };
	});

	return useComputed(() => cidSig.value !== undefined ? result.value : fallback);
}
