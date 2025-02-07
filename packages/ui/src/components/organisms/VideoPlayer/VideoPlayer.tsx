import { Fullscreen, FullscreenExit, Pause, PlayArrow, VolumeDown, VolumeUp } from '@mui/icons-material';
import { IconButton, Slider, Stack } from '@mui/material';
import { computed, useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { IMediaPlayerService, IMediaPlayerServiceSymbol } from '../../../services';
import { IVideoFile } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../../context';
import { useHotkey } from '../../../hooks';
import { FileInfoDisplay } from '../../atoms/FileInfoDisplay';
import styles from './VideoPlayer.module.css';

export function VideoPlayer(props: { file: IVideoFile; autoPlay?: boolean; }) {
	const mediaPlayer = useService<IMediaPlayerService>(IMediaPlayerServiceSymbol);

	const videoRef = useSignal<HTMLVideoElement | null>(null);
	const containerRef = useSignal<HTMLDivElement | null>(null);
	const progressRef = useSignal<HTMLDivElement | null>(null);
	const progressBarRef = useSignal<HTMLDivElement | null>(null);
	const fullScreen = useSignal<boolean>(false);
	const volume = useSignal<number>(1);
	const overlayVisible = useSignal<boolean>(false);

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

	useSignalEffect(() => {
		if (videoRef.value) {
			//Event handlers
			videoRef.value.addEventListener('timeupdate', handleProgress);

			return mediaPlayer.initializeVideo(videoRef.value, props.file);
		}
		return () => { };
	});

	useSignalEffect(() => {
		if (progressRef.value) {
			progressRef.value.addEventListener('click', scrub);
			let mousedown = false;
			progressRef.value.addEventListener('mousedown', () => (mousedown = true));
			progressRef.value.addEventListener('mousemove', (e) => mousedown && scrub(e));
			progressRef.value.addEventListener('mouseup', () => (mousedown = false));
		}
	});

	useSignalEffect(() => {
		volume.subscribe((value) => {
			if (videoRef.value) {
				videoRef.value.volume = value;
			}
		});
	});

	function scrub(e: MouseEvent) {
		if (progressRef.value && videoRef.value) {
			const scrubTime = (e.offsetX / progressRef.value.offsetWidth) * videoRef.value.duration;
			videoRef.value.currentTime = scrubTime;
		}
	}

	function toggleFullScreen() {
		if (fullScreen.value) {
			document.exitFullscreen()
				.then(() => {
					fullScreen.value = false;
				});
		} else {
			containerRef.value?.requestFullscreen()
				.then(() => {
					fullScreen.value = true;
				});
		}
	}

	function handleProgress() {
		if (videoRef.value && progressBarRef.value) {
			const progressPercentage = (videoRef.value.currentTime / videoRef.value.duration) * 100;
			progressBarRef.value.style.width = `${progressPercentage}%`;
		}
	}

	useHotkey({ key: 'F' }, () => toggleFullScreen());
	useHotkey({ key: 'Space' }, () => mediaPlayer.togglePlay());

	const progress = useComputed(() => (
		<div className={styles.progress} ref={(ref) => progressRef.value = ref}>
			<div className={styles.progressFilled} ref={(ref) => progressBarRef.value = ref} />
		</div>
	));

	return (
		<div className={styles.outerContainer}>
			<div className={styles.innerContainer} ref={(ref) => containerRef.value = ref}>
				<video
					controls={false}
					ref={(ref) => {
						videoRef.value = ref;
					}}
					preload={'metadata'}
					className={styles.video}
				/>
				{useComputed(() => (
					<div className={`${styles.videoOverlay} ${overlayVisible.value ? styles.visible : ''}`}>
						<div>
							<FileInfoDisplay file={props.file} />
						</div>
						<div className={styles.spacer} onClick={() => mediaPlayer.togglePlay()} onDoubleClick={() => toggleFullScreen()} />
						<div className={styles.toolbar}>
							<IconButton onClick={() => mediaPlayer.togglePlay()}>
								{computed(() => mediaPlayer.playing.value ? <Pause /> : <PlayArrow />)}
							</IconButton>
							<div className={styles.spacer} />
							<div>
								Language
								<select>
									{computed(() => mediaPlayer.languages.value.map(l => (
										<option>{l}</option>
									)))}
								</select>
								Subtitle
								<select onChange={(ev) => {
									mediaPlayer.selectSubtitle(ev.currentTarget.value !== 'null' ? ev.currentTarget.value : undefined);
								}}>
									<option value="null">None</option>
									{computed(() => mediaPlayer.subtitles.value.map(l => (
										<option>{l.language}</option>
									)))}
								</select>
							</div>
							<Stack spacing={2} direction="row" sx={{ alignItems: 'center', width: 250 }}>
								<IconButton onClick={() => { volume.value = 0; }}>
									<VolumeDown />
								</IconButton>
								{computed(() => (
									<Slider
										value={volume.value}
										onChange={(_, value) => volume.value = value as number}
										min={0}
										max={1}
										step={0.05} />
								))}
								<IconButton onClick={() => { volume.value = 1; }}>
									<VolumeUp />
								</IconButton>
							</Stack>
							<IconButton onClick={() => toggleFullScreen()}>
								{computed(() => fullScreen.value ? <FullscreenExit /> : <Fullscreen />)}
							</IconButton>
						</div>
						{progress}
					</div>
				))}
			</div>
		</div>
	);
};
