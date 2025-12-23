import { computed, useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import React from 'react';
import { useService } from '../../../context';
import { IMediaPlayerService, IMediaPlayerServiceSymbol, IVideoPlayerService, IVideoPlayerServiceSymbol } from '../../../services';
import { FileInfoDisplay } from '../../atoms';
import { MediaProgressBar } from '../../molecules';
import styles from './MediaPlayer.module.scss';
import { MediaPlayerButtons } from './MediaPlayerButtons';
import { VideoPlayerButtons } from './VideoPlayerButtons';

export function VideoPlayer() {
	const player = useService<IMediaPlayerService>(IMediaPlayerServiceSymbol);
	const videoPlayer = useService<IVideoPlayerService>(IVideoPlayerServiceSymbol);

	const containerRef = useSignal<HTMLDivElement | null>(null);
	const videoRef = useSignal<HTMLVideoElement | null>(null);
	const overlayVisible = useSignal<boolean>(false);

	const videoEl = useComputed(() => (
		<video
			controls={false}
			ref={(ref) => {
				videoRef.value = ref;
			}}
			preload={'auto'}
			className={styles.video}
		/>
	));

	useSignalEffect(() => {
		if (videoRef.value && containerRef.value) {
			return videoPlayer.registerVideoElement(videoRef.value, containerRef.value);
		}
		return () => { };
	});

	useSignalEffect(() => {
		if (containerRef.value) {
			let timeout: NodeJS.Timeout;
			const abortController = new AbortController();
			containerRef.value.addEventListener('mousemove', () => {
				overlayVisible.value = true;
				if (timeout) {
					clearTimeout(timeout);
				}
				timeout = setTimeout(() => {
					overlayVisible.value = false;
				}, 3000);
			}, { signal: abortController.signal });

			return () => {
				abortController.abort();
			};
		}

		return () => { };
	});

	return (
		<div
			className={styles.videoContainer}
			ref={(ref) => containerRef.value = ref}
		>
			{videoEl}
			{useComputed(() => (
				<div className={`${styles.overlay} ${overlayVisible.value && player.open.value ? '' : styles.hidden}`}>
					<div>
						{computed(() => player.nowPlaying.value && (<FileInfoDisplay file={player.nowPlaying.value} />))}
					</div>
					<div style={{ flexGrow: 1 }} />
					<div>
						<MediaPlayerButtons
							showFullscreen={true}
							additional={<VideoPlayerButtons />}
						/>
						<MediaProgressBar />
					</div>
				</div>
			))}
		</div>
	);
}
