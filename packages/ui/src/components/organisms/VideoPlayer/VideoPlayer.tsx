import { Fullscreen, FullscreenExit, Pause, PlayArrow, VolumeDown, VolumeUp } from '@mui/icons-material';
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

	useHotkey({ key: 'F' }, () => toggleFullScreen());
	useHotkey({ key: ' ' }, () => mediaPlayer.togglePlay());

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
						<div className={styles.spacer} onClick={() => mediaPlayer.togglePlay()} onDoubleClick={() => toggleFullScreen()}>
							{loading.value && <Loader />}
						</div>
						<div className={styles.toolbar}>
							<IconButton onClick={() => mediaPlayer.togglePlay()}>
								{computed(() => mediaPlayer.playing.value ? <Pause /> : <PlayArrow />)}
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
						<VideoProgressBar videoRef={videoRef} />
					</div>
				))}
			</div>
		</div>
	);
};
