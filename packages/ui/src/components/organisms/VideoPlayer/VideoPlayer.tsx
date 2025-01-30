import { Fullscreen, FullscreenExit, Pause, PlayArrow, VolumeDown, VolumeUp } from '@mui/icons-material';
import { IconButton, Slider, Stack } from '@mui/material';
import { computed, useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { IIpfsService, IIpfsServiceSymbol, IVideoFile } from 'ipmc-interfaces';
import React from 'react';
//@ts-ignore
import shaka from 'shaka-player';
import { useService } from '../../../context';
import { useHotkey } from '../../../hooks';
import { FileInfoDisplay } from '../../atoms/FileInfoDisplay';
import styles from './VideoPlayer.module.css';
import { TimeDisplay } from '../../atoms/TimeDisplay';

function createShakaIpfsPlugin(ipfs: IIpfsService): shaka.extern.SchemePlugin {
	return async (uri: string, request: shaka.extern.Request, requestType: shaka.net.NetworkingEngine.RequestType, progressUpdated: shaka.extern.ProgressUpdated, headersReceived: shaka.extern.HeadersReceived, config: shaka.extern.SchemePluginConfig) => {
		const fullPath = uri.substring(uri.indexOf('://') + 3);
		const paths = fullPath.split('/');
		const cid = paths.shift()!;
		const path = paths.join('/');

		headersReceived({});

		const data = await ipfs.fetch(cid, path);

		return {
			uri: uri,
			originalUri: uri,
			data: data,
			status: 200,
		};
	};
}

export function VideoPlayer(props: { file: IVideoFile; autoPlay?: boolean; }) {
	const ipfs = useService<IIpfsService>(IIpfsServiceSymbol);
	const videoRef = useSignal<HTMLVideoElement | null>(null);
	const containerRef = useSignal<HTMLDivElement | null>(null);
	const progressRef = useSignal<HTMLDivElement | null>(null);
	const progressBarRef = useSignal<HTMLDivElement | null>(null);
	const playerRef = useSignal<any | null>(null);
	const subtitles = useSignal<any[]>([]);
	const languages = useSignal<string[]>([]);
	const playing = useSignal<boolean>(props.autoPlay ?? false);
	const fullScreen = useSignal<boolean>(false);
	const volume = useSignal<number>(1);
	const overlayVisible = useSignal<boolean>(false);
	const movieDuration = useSignal<number>(0);
	const currentPlayTime = useSignal<number>(0);

	useSignalEffect(() => {
		if (containerRef.value != null) {
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
		if (videoRef.value != null && progressRef.value != null) {
			//Event handlers
			videoRef.value.addEventListener('timeupdate', handleProgress);
			videoRef.value.addEventListener('loadedmetadata', () => {
				if (videoRef.value) {
					movieDuration.value = videoRef.value.duration;
				}
			});
			progressRef.value.addEventListener('click', scrub);
			let mousedown = false;
			progressRef.value.addEventListener('mousedown', () => (mousedown = true));
			progressRef.value.addEventListener('mousemove', (e) => mousedown && scrub(e));
			progressRef.value.addEventListener('mouseup', () => (mousedown = false));

			// Shaka player init
			shaka.net.NetworkingEngine.registerScheme('ipfs', createShakaIpfsPlugin(ipfs), 1, false);
			const player = new shaka.Player();
			player.configure({
				streaming: {
					rebufferingGoal: 5,
					bufferingGoal: 30,
				}
			});
			playerRef.value = player;
			player.attach(videoRef.value)
				.then(() => player.load(`ipfs://${props.file.cid}/${props.file.video.name}`))
				.then(() => {
					subtitles.value = player.getTextTracks();
					languages.value = player.getAudioLanguages();
				})
				.catch((ex: any) => {
					console.error(ex);
				});

			return () => {
				player.unload();
				player.destroy();
			};
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

	function scrub(e: MouseEvent) {
		if (progressRef.value && videoRef.value) {
			const scrubTime = (e.offsetX / progressRef.value.offsetWidth) * videoRef.value.duration;
			videoRef.value.currentTime = scrubTime;
		}
	}

	function togglePlay() {
		if (playing.value) {
			if (videoRef.value) {
				videoRef.value.pause();
				playing.value = false;
			}
		} else {
			videoRef.value?.play()
				.then(() => {
					playing.value = true;
				});
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
			currentPlayTime.value = videoRef.value.currentTime;

			progressBarRef.value.style.width = `${progressPercentage}%`;
		}
	}

	useHotkey({ key: 'F' }, () => toggleFullScreen());
	useHotkey({ key: 'Space' }, () => togglePlay());

	const progressBar = useComputed(() => (
		<div className={styles.progress} ref={(ref) => progressRef.value = ref}>
			<div className={styles.progressFilled} ref={(ref) => progressBarRef.value = ref} />
		</div>
	));

	const progress = useComputed(() => (
		<div className={styles.progressContainer}>
			<TimeDisplay
				time={currentPlayTime.value}
			/>
			{progressBar}
			<TimeDisplay
				time={movieDuration.value}
			/>
		</div>
	));

	return (
		<div className={styles.outerContainer}>
			<div className={styles.innerContainer} ref={(ref) => containerRef.value = ref}>
				{useComputed(() => (
					<div className={`${styles.videoOverlay} ${overlayVisible.value ? styles.visible : ''}`}>
						<div>
							<FileInfoDisplay file={props.file} />
						</div>
						<div className={styles.spacer} />
						<div className={styles.toolbar}>
							<IconButton onClick={() => togglePlay()}>
								{computed(() => playing.value ? <Pause /> : <PlayArrow />)}
							</IconButton>
							<div>
								<span className={styles.videoText}>Language</span>
								<select>
									{computed(() => languages.value.map(l => (
										<option>{l}</option>
									)))}
								</select>
							</div>
							<div>
								<span className={styles.videoText}>Subtitle</span>
								<select onChange={(ev) => {
									if (ev.currentTarget.value !== 'null') {
										playerRef.value.selectTextTrack(ev.currentTarget.value);
										playerRef.value.setTextTrackVisibility(true);
									} else {
										playerRef.value.setTextTrackVisibility(false);
									}
								}}>
									<option value="null">None</option>
									{computed(() => subtitles.value.map(l => (
										<option>{l.language}</option>
									)))}
								</select>
							</div>
							<Stack spacing={2} direction="row" sx={{ alignItems: 'center', width: 250 }}>
								<VolumeDown />
								{computed(() => (
									<Slider
										value={volume.value}
										onChange={(_, value) => volume.value = value as number}
										min={0}
										max={1}
										step={0.05} />
								))}
								<VolumeUp />
							</Stack>
							<IconButton onClick={() => toggleFullScreen()}>
								{computed(() => playing.value ? <FullscreenExit /> : <Fullscreen />)}
							</IconButton>
						</div>
						{progress}
					</div>
				))}
				<video
					controls={false}
					ref={(ref) => {
						videoRef.value = ref;
					}}
					preload={'metadata'}
					className={styles.video}
				/>
			</div>
		</div>
	);
}
