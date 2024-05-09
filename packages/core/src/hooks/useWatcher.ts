import { ReadonlySignal, useSignal } from '@preact/signals-react';

export function useWatcher<T>(value: T): ReadonlySignal<T> {
	const signal = useSignal(value);
	signal.value = value;
	return signal;
}
