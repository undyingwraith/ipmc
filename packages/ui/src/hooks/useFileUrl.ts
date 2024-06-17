import { IIpfsService, IIpfsServiceSymbol } from 'ipmc-interfaces';
import { useService } from '../context/AppContext';

export function useFileUrl(cid?: string, fallback?: string): string | undefined {
	const ipfs = useService<IIpfsService>(IIpfsServiceSymbol);

	return cid ? ipfs.toUrl(cid) : fallback ?? undefined;
}
