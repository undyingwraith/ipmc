import { useSignal, useSignalEffect } from '@preact/signals-react';
import React from 'react';
import { useService } from '../../../context';
import { IMediaPlayerService, IMediaPlayerServiceSymbol } from '../../../services';
import { TimeDisplay } from '../../atoms';
import styles from './MediaProgressBar.module.css';

export function MediaProgressBar() {

	const player = useService<IMediaPlayerService>(IMediaPlayerServiceSymbol);

	const progressRef = useSignal<HTMLDivElement | null>(null);
	const progressBarRef = useSignal<HTMLDivElement | null>(null);
	const progressBarBufferedRef = useSignal<HTMLDivElement | null>(null);

	useSignalEffect(() => {
		if (progressBarRef.value && progressBarBufferedRef.value) {
			const current = player.currentTime.value;
			const buffered = player.bufferedTime.value;
			const total = player.totalTime.value;

			const progressPercentage = 100 - ((current / total) * 100);
			const bufferedPercentage = 100 - ((buffered / total) * 100);

			progressBarRef.value.style.clipPath = `inset(0 ${progressPercentage}% 0 0)`;
			progressBarBufferedRef.value.style.clipPath = `inset(0 ${bufferedPercentage}% 0 0)`;
		}
	});

	function scrub(e: MouseEvent) {
		if (progressRef.value) {
			const scrubTime = (e.offsetX / progressRef.value.offsetWidth) * player.totalTime.value;
			player.setCurrentTime(scrubTime);
		}
	}

	useSignalEffect(() => {
		if (progressRef.value) {
			progressRef.value.addEventListener('click', scrub);
			let mousedown = false;
			progressRef.value.addEventListener('mousedown', () => (mousedown = true));
			progressRef.value.addEventListener('mousemove', (e) => mousedown && scrub(e));
			progressRef.value.addEventListener('mouseup', () => (mousedown = false));
			progressRef.value.addEventListener('mouseleave', () => (mousedown = false));
		}
	});

	return (
		<div className={styles.progressContainer}>
			<TimeDisplay
				time={player.currentTime}
			/>
			<div className={styles.progress} ref={(ref) => progressRef.value = ref}>
				<div className={styles.progressBuffered} ref={(ref) => progressBarBufferedRef.value = ref} />
				<div className={styles.progressFilled} ref={(ref) => progressBarRef.value = ref} />
			</div>
			<TimeDisplay
				time={player.totalTime}
			/>
		</div>
	);
}
