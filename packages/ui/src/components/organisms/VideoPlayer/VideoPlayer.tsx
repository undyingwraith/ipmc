import React, { useRef } from 'react';
import { IVideoFile } from 'ipmc-interfaces';
import { useProfile } from '../../../context/ProfileContext';
import { useHotkey } from '../../../hooks';
import styles from './VideoPlayer.module.css';
import { FileInfoDisplay } from '../../atoms/FileInfoDisplay';
import { useComputed, useSignal } from '@preact/signals-react';
import { IconButton } from '@mui/material';
import { Fullscreen, FullscreenExit, Pause, PlayArrow } from '@mui/icons-material';

export function VideoPlayer(props: { file: IVideoFile; autoPlay?: boolean; }) {
	const { ipfs } = useProfile();
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const playing = useSignal<boolean>(props.autoPlay ?? false);
	const fullScreen = useSignal<boolean>(false);

	function togglePlay() {
		if (playing.value) {
			if (videoRef.current) {
				videoRef.current.pause();
				playing.value = false;
			}
		} else {
			videoRef.current?.play()
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
			containerRef.current?.requestFullscreen()
				.then(() => {
					fullScreen.value = true;
				});
		}
	}

	useHotkey({ key: 'F' }, () => toggleFullScreen());
	useHotkey({ key: 'Space' }, () => togglePlay());

	return (
		<div className={styles.outerContainer}>
			<div className={styles.innerContainer} ref={containerRef}>
				<div className={styles.videoOverlay}>
					<div>
						<FileInfoDisplay file={props.file} />
					</div>
					<div className={styles.spacer} />
					<div className={styles.toolbar}>
						<IconButton onClick={() => togglePlay()}>
							{useComputed(() => playing.value ? <Pause /> : <PlayArrow />)}
						</IconButton>
						<div className={styles.spacer} />
						<IconButton onClick={() => toggleFullScreen()}>
							{useComputed(() => playing.value ? <FullscreenExit /> : <Fullscreen />)}
						</IconButton>
					</div>
				</div>
				<video ref={videoRef} preload={'metadata'} className={styles.video}>
					<source src={ipfs.toUrl(props.file.video.cid)}></source>
				</video>
			</div>
		</div>
	);
}
