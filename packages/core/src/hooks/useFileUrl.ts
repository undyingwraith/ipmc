import { useApp } from "../components/pages/AppContext";

export function useFileUrl(cid?: string, fallback?: string): string | undefined {
	const { ipfs } = useApp();

	return cid ? ipfs.toUrl(cid) : fallback ?? undefined;
}
