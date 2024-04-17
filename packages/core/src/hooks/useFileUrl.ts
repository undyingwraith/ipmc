import { useApp } from "../components/pages/AppContext";

export function useFileUrl(cid: string) {
	const { ipfs } = useApp()

	return ipfs.toUrl(cid);
}
