import { ExpandLess, ExpandMore, List } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useComputed, useSignal } from '@preact/signals-react';
import { isTitleFeature } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../../context';
import { IMediaPlayerService, IMediaPlayerServiceSymbol } from '../../../services';
import { VideoProgressBar } from '../../molecules';
import { FileList, MediaPlayerButtons } from '../../organisms';
import styles from './MediaPlayer.module.scss';
import { VideoPlayer } from './VideoPlayer';

export function MediaPlayer() {
	const player = useService<IMediaPlayerService>(IMediaPlayerServiceSymbol);

	const videoRef = useSignal<HTMLVideoElement | null>(null);
	const queueOpen = useSignal(false);
	const variant = useComputed(() => player.nowPlaying.value === undefined ? styles.hidden : player.open.value ? styles.open : '');
	const title = useComputed(() => player.nowPlaying.value == undefined ? '' : isTitleFeature(player.nowPlaying.value) ? player.nowPlaying.value.title : player.nowPlaying.value.name);


	const toolbarEl = useComputed(() => (
		<div className={styles.toolbar}>
			<h5>{title}</h5>
			<IconButton onClick={() => queueOpen.value = !queueOpen.value}>
				<List />
			</IconButton>
			<IconButton onClick={() => player.open.value = !player.open.value}>
				<ExpandMore />
			</IconButton>
			<div className={`${styles.queue} ${queueOpen.value && player.open.value ? styles.open : ''}`}>
				<FileList files={player.queue.value} onOpen={(i, k) => {
					player.queueIndex.value = k;
					queueOpen.value = false;
				}} />
			</div>
		</div>
	));

	const controlsEl = useComputed(() => (
		<div className={styles.controlsContainer}>
			<VideoPlayer videoRef={videoRef} />
			<div className={styles.controls}>
				<div>
					<h5>{title}</h5>
					<IconButton onClick={() => player.open.value = !player.open.value}>
						<ExpandLess />
					</IconButton>
				</div>
				<div className={styles.spacer} />
				<MediaPlayerButtons />
				<VideoProgressBar videoRef={videoRef} />
			</div>
		</div>
	));

	return useComputed(() => (
		<div className={`${styles.container} ${variant.value}`}>
			<div className={styles.item}>
				{toolbarEl}
				{controlsEl}
			</div>
		</div>
	));
}
