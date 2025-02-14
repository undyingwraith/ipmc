import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

export function useLinkedSignal<T>(prop: T) {
	const sig = useSignal(prop);
	useEffect(() => {
		sig.value = prop;
	}, [prop]);
	return sig;
}
