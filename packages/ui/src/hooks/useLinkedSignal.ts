import { useSignal } from '@preact/signals-react';
import { useEffect } from 'react';

export function useLinkedSignal<T>(prop: T) {
	const sig = useSignal(prop);
	useEffect(() => {
		sig.value = prop;
	}, [prop]);
	return sig;
}
