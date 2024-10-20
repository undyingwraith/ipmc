import { IIpfsService, IIpfsServiceSymbol } from 'ipmc-interfaces';
import { useService } from '../context/AppContext';
import { ReadonlySignal, useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { useLinkedSignal } from './useLinkedSignal';
import { fileTypeFromBuffer } from 'file-type';

export function useFileUrl(cid?: string, fallback?: string): ReadonlySignal<string | undefined> {
	const result = useSignal<string | undefined>(undefined);
	const heliaService = useService<IIpfsService>(IIpfsServiceSymbol);
	const cidSig = useLinkedSignal(cid);

	useSignalEffect(() => {
		const controller = new AbortController();
		const cid = cidSig.value;
		if (cid !== undefined) {

			(async () => {
				const data = await heliaService.fetch(cid);
				const fileType = await fileTypeFromBuffer(data);
				if (fileType) {
					const blob = new Blob([data], {
						type: fileType.mime,
					});
					if (!controller.signal.aborted) {
						result.value = URL.createObjectURL(blob);
					}
				}
			})();

			return () => {
				controller.abort();
				if (result.value) {
					URL.revokeObjectURL(result.value);
				}
			};
		}

		return () => { };
	});

	return useComputed(() => cidSig.value !== undefined ? result.value : fallback);
}
