import { ArrowDownward, ArrowUpward, Delete, ExpandLess, ExpandMore, List } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { batch, useComputed, useSignal } from '@preact/signals-react';
import { isTitleFeature } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../../context';
import { IMediaPlayerService, IMediaPlayerServiceSymbol } from '../../../services';
import { MediaProgressBar } from '../../molecules';
import { FileList, MediaPlayerButtons } from '../../organisms';
import styles from './MediaPlayer.module.scss';
import { VideoPlayer } from './VideoPlayer';

export function MediaPlayer() {
	const player = useService<IMediaPlayerService>(IMediaPlayerServiceSymbol);

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
				<FileList
					files={player.queue.value}
					actions={(f, i) => (<div>
						<IconButton
							disabled={i === 0}
							onClick={() => {
								const queue = player.queue.value;
								player.queue.value = queue.toSpliced(i - 1, 2, queue[i], queue[i - 1]);
							}}
						>
							<ArrowUpward />
						</IconButton>
						<IconButton
							disabled={i + 1 === player.queue.value.length}
							onClick={() => {
								const queue = player.queue.value;
								player.queue.value = queue.toSpliced(i, 2, queue[i + 1], queue[i]);
							}}
						>
							<ArrowDownward />
						</IconButton>
						<IconButton
							onClick={() => {
								batch(() => {
									player.queue.value = player.queue.value.toSpliced(i, 1);
									if (i < player.queueIndex.value) {
										player.queueIndex.value -= 1;
									} else if (i === player.queueIndex.value && i === player.queue.value.length) {
										player.queueIndex.value -= 1;
										player.playing.value = false;
									}
								});
							}}
						>
							<Delete />
						</IconButton>
					</div>)}
					selected={player.queueIndex.value}
					onOpen={(_, k) => {
						player.queueIndex.value = k;
						queueOpen.value = false;
					}}
				/>
			</div>
		</div>
	));

	const controlsEl = useComputed(() => (
		<div className={styles.controlsContainer}>
			<VideoPlayer />
			<div className={styles.controls}>
				<div>
					<h5>{title}</h5>
					<IconButton onClick={() => player.open.value = !player.open.value}>
						<ExpandLess />
					</IconButton>
				</div>
				<div className={styles.spacer} />
				<MediaPlayerButtons />
				<MediaProgressBar />
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
