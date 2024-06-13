import { useProfile } from "../context/ProfileContext";

export function useFileUrl(cid?: string, fallback?: string): string | undefined {
	const { ipfs } = useProfile();

	return cid ? ipfs.toUrl(cid) : fallback ?? undefined;
}
