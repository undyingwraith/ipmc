import { Signal, useComputed } from '@preact/signals-react';
import React from 'react';

export function TimeDisplay(props: { time: Signal<number>; }) {
	const { time } = props;

	function pad(num: number) {
		const str = '00' + num;
		return (str).substring(str.length - 2);
	}

	const hours = useComputed(() => pad(Math.floor(time.value / 3600)));
	const minutes = useComputed(() => pad(Math.floor(time.value % 3600 / 60)));
	const seconds = useComputed(() => pad(Math.floor(time.value % 3600 % 60)));

	return (
		<div>
			{hours}:{minutes}:{seconds}
		</div>
	);
}
