import React from 'react';

export function TimeDisplay(props: { time: number; }) {
	const { time } = props;

	function pad(num: number) {
		const test = '00' + num;
		return (test).substring(test.length - 2);
	}

	const hours = Math.floor(time / 3600);
	const minutes = Math.floor(time % 3600 / 60);
	const seconds = Math.floor(time % 3600 % 60);

	return (
		<div>
			{`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`}
		</div>
	);
}
