import { IPersistentSignalService, IPersistentSignalServiceSymbol } from 'ipmc-interfaces';
import { useService } from '../context';

export function usePersistentSignal<T>(defaultValue: T, storageKey: string) {
	const signalService = useService<IPersistentSignalService>(IPersistentSignalServiceSymbol);

	return signalService.get(storageKey, defaultValue);
}
