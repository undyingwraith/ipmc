import { Signal, useSignal } from '@preact/signals-react';
import { RefObject, useEffect } from 'react';


let listenerCallbacks = new WeakMap();

let observer: IntersectionObserver;

function handleIntersections(entries: any[]) {
	entries.forEach(entry => {
		if (listenerCallbacks.has(entry.target)) {
			let cb = listenerCallbacks.get(entry.target);

			if (entry.isIntersecting || entry.intersectionRatio > 0) {
				observer.unobserve(entry.target);
				listenerCallbacks.delete(entry.target);
				cb();
			}
		}
	});
}

function getIntersectionObserver() {
	if (observer === undefined) {
		observer = new IntersectionObserver(handleIntersections, {
			rootMargin: '100px',
			threshold: 0.15,
		});
	}
	return observer;
}

export function useIsVisible(elem: RefObject<HTMLDivElement | null>): Signal<boolean> {
	const visible = useSignal<boolean>(false);

	useEffect(() => {
		let target = elem?.current;
		if (target !== null) {
			let observer = getIntersectionObserver();
			listenerCallbacks.set(target, () => {
				visible.value = true;
			});
			observer.observe(target);

			return () => {
				listenerCallbacks.delete(target);
				observer.unobserve(target);
			};
		} else {
			return () => {
				// NOOP
			};
		}
	}, []);

	return visible;
}

