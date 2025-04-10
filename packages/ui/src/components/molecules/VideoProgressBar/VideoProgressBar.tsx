import { ReadonlySignal, useSignal, useSignalEffect } from '@preact/signals-react';
import React from 'react';
import { TimeDisplay } from '../../atoms';
import styles from './VideoProgressBar.module.css';

export function VideoProgressBar(props: { videoRef: ReadonlySignal<HTMLVideoElement | null>; }) {
	const { videoRef } = props;

	const progressRef = useSignal<HTMLDivElement | null>(null);
	const progressBarRef = useSignal<HTMLDivElement | null>(null);
	const progressBarBufferedRef = useSignal<HTMLDivElement | null>(null);

	const movieDuration = useSignal<number>(0);
	const currentPlayTime = useSignal<number>(0);

	function handleProgress() {
		if (videoRef.value && progressBarRef.value && progressBarBufferedRef.value) {
			const progressPercentage = 100 - ((videoRef.value.currentTime / videoRef.value.duration) * 100);
			const bufferedPercentage = 100 - (((videoRef.value.buffered.length === 0 ? 0 : videoRef.value.buffered.end(0)) / videoRef.value.duration) * 100);
			currentPlayTime.value = videoRef.value.currentTime;

			progressBarRef.value.style.clipPath = `inset(0 ${progressPercentage}% 0 0)`;
			progressBarBufferedRef.value.style.clipPath = `inset(0 ${bufferedPercentage}% 0 0)`;
		}
	}

	function scrub(e: MouseEvent) {
		if (progressRef.value && videoRef.value) {
			const scrubTime = (e.offsetX / progressRef.value.offsetWidth) * videoRef.value.duration;
			videoRef.value.currentTime = scrubTime;
			handleProgress();
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

	useSignalEffect(() => {
		if (videoRef.value) {
			//Event handlers
			videoRef.value.addEventListener('timeupdate', handleProgress);
			videoRef.value.addEventListener('loadedmetadata', () => {
				if (videoRef.value) {
					movieDuration.value = videoRef.value.duration;
				}
			});
		}
	});

	return (
		<div className={styles.progressContainer}>
			<TimeDisplay
				time={currentPlayTime}
			/>
			<div className={styles.progress} ref={(ref) => progressRef.value = ref}>
				<div className={styles.progressBuffered} ref={(ref) => progressBarBufferedRef.value = ref} />
				<div className={styles.progressFilled} ref={(ref) => progressBarRef.value = ref} />
			</div>
			<TimeDisplay
				time={movieDuration}
			/>
		</div>
	);
}
