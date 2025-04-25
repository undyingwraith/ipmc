import { Forward30, Fullscreen, FullscreenExit, Pause, PlayArrow, Replay30, VolumeDown, VolumeUp } from '@mui/icons-material';
import { IconButton, Slider, Stack } from '@mui/material';
import { computed, useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { IVideoFile } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../../context';
import { useHotkey } from '../../../hooks';
import { IMediaPlayerService, IMediaPlayerServiceSymbol } from '../../../services';
import { FileInfoDisplay, Loader } from '../../atoms';
import { VideoProgressBar } from '../../molecules';
import styles from './VideoPlayer.module.css';

export function VideoPlayer(props: { file: IVideoFile; autoPlay?: boolean; }) {
	const mediaPlayer = useService<IMediaPlayerService>(IMediaPlayerServiceSymbol);
	const volumeStep = 0.1;
	let clickTimeout: NodeJS.Timeout | undefined;

	const videoRef = useSignal<HTMLVideoElement | null>(null);
	const containerRef = useSignal<HTMLDivElement | null>(null);
	const fullScreen = useSignal<boolean>(false);
	const volume = useSignal<number>(1);
	const overlayVisible = useSignal<boolean>(false);
	const loading = useSignal<boolean>(true);

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
		if (videoRef.value && containerRef.value) {
			//Event handlers
			videoRef.value.addEventListener('waiting', () => {
				loading.value = true;
			});
			videoRef.value.addEventListener('stalled', () => {
				loading.value = true;
			});
			videoRef.value.addEventListener('canplay', () => {
				loading.value = false;
			});

			return mediaPlayer.initializeVideo(videoRef.value, props.file);
		}
		return () => { };
	});

	useSignalEffect(() => {
		volume.subscribe((value) => {
			if (videoRef.value) {
				videoRef.value.volume = value;
			}
		});
	});

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

	function replay() {
		mediaPlayer.jumpRelative(-30);
	}

	function forward() {
		mediaPlayer.jumpRelative(30);
	}

	useHotkey({ key: 'F' }, toggleFullScreen);
	useHotkey({ key: ' ' }, () => mediaPlayer.togglePlay());
	useHotkey({ key: 'ArrowRight' }, forward);
	useHotkey({ key: 'ArrowLeft' }, replay);
	useHotkey({ key: 'ArrowUp' }, () => {
		if (volume.peek() + volumeStep < 1) {
			volume.value += volumeStep;
		}
	});
	useHotkey({ key: 'ArrowDown' }, () => {
		if (volume.peek() + volumeStep >= 0) {
			volume.value -= volumeStep;
		}
	});

	return (
		<div className={styles.outerContainer}>
			<div className={styles.innerContainer} ref={(ref) => containerRef.value = ref}>
				<video
					controls={false}
					ref={(ref) => {
						videoRef.value = ref;
					}}
					preload={'auto'}
					className={styles.video}
				/>
				<div className={`${styles.videoOverlay} ${styles.visible}`}>
					<div className={styles.spacer}>
						{useComputed(() => loading.value && <Loader />)}
					</div>
				</div>
				{useComputed(() => (
					<div className={`${styles.videoOverlay} ${overlayVisible.value ? styles.visible : ''}`}>
						<div>
							<FileInfoDisplay file={props.file} />
						</div>
						<div className={styles.spacer} onClick={() => {
							if (clickTimeout !== undefined) {
								clearTimeout(clickTimeout);
								return;
							}

							clickTimeout = setTimeout(() => {
								clickTimeout = undefined;
								mediaPlayer.togglePlay();
							}, 300);
						}}>
							<div className={styles.spacer} onDoubleClick={replay} />
							<div className={`${styles.spacer} ${styles.center}`} onDoubleClick={toggleFullScreen} />
							<div className={styles.spacer} onDoubleClick={forward} />
						</div>
						<div className={styles.toolbar}>
							<IconButton onClick={() => replay()}>
								<Replay30 />
							</IconButton>
							<IconButton onClick={() => mediaPlayer.togglePlay()}>
								{computed(() => mediaPlayer.playing.value ? <Pause /> : <PlayArrow />)}
							</IconButton>
							<IconButton onClick={() => forward()}>
								<Forward30 />
							</IconButton>
							<div className={styles.spacer} />
							<div>
								<span>Language</span>
								<select onChange={(ev) => {
									mediaPlayer.selectLanguage(ev.currentTarget.value);
								}}>
									{props.file.languages.map(l => (
										<option>{l}</option>
									))}
								</select>
							</div>
							<div>
								<span>Subtitle</span>
								<select onChange={(ev) => {
									mediaPlayer.selectSubtitle(ev.currentTarget.value !== 'null' ? JSON.parse(ev.currentTarget.value) : undefined);
								}}>
									<option value="null">None</option>
									{props.file.subtitles.map(s => (
										<option value={JSON.stringify(s)}>{s.language}{s.forced && ' - forced'}</option>
									))}
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
										step={volumeStep} />
								))}
								<IconButton onClick={() => { volume.value = 1; }}>
									<VolumeUp />
								</IconButton>
							</Stack>
							<IconButton onClick={() => toggleFullScreen()}>
								{computed(() => fullScreen.value ? <FullscreenExit /> : <Fullscreen />)}
							</IconButton>
						</div>
						<VideoProgressBar videoRef={videoRef} />
					</div>
				))}
			</div>
		</div>
	);
};
