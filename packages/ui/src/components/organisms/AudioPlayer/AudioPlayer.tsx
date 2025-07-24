import React from 'react';
import { Forward30, Fullscreen, FullscreenExit, Pause, PlayArrow, Replay30, VolumeDown, VolumeUp } from '@mui/icons-material';

import { IconButton, Slider, Stack } from '@mui/material';
import { IAudioFile } from 'ipmc-interfaces';
import { useService } from '../../../context';
import { IMediaPlayerService, IMediaPlayerServiceSymbol } from '../../../services';
import { computed, useSignal, useSignalEffect } from '@preact/signals-react';
import { useHotkey } from '../../../hooks';
import styles from './AudioPlayer.module.css';
import { FileInfoDisplay } from 'src/components/atoms';


export function AudioPlayer(props: { file: IAudioFile; autoPlay?: boolean; }) {
	const mediaPlayer = useService<IMediaPlayerService>(IMediaPlayerServiceSymbol);
	const volumeStep = 0.1;
	let clickTimeout: NodeJS.Timeout | undefined;

	const audioRef = useSignal<HTMLAudioElement | null>(null);
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
		//Event handlers
		if (audioRef.value && containerRef.value) {
			audioRef.value.addEventListener('waiting', () => {
				loading.value = true;
			});
			audioRef.value.addEventListener('stalled', () => {
				loading.value = true;
			});
			audioRef.value.addEventListener('canplay', () => {
				loading.value = false;
			});

			return mediaPlayer.initializeAudio(audioRef.value, props.file);
		}
		return () => { };
	});

	useSignalEffect(() => {
		volume.subscribe((value) => {
			if (audioRef.value) {
				audioRef.value.volume = value;
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
				<audio
					controls={false}
					ref={(ref) => {
						audioRef.value = ref;
					}}
					preload={'auto'}
					className={styles.audio}
				/>
				<div className={`${styles.audioOverlay} ${overlayVisible.value ? styles.visible : ''}`}>
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
				</div>
			</div>
		</div>
	);
}
