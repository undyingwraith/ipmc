import { Fullscreen, FullscreenExit, Pause, PlayArrow, SkipNext, SkipPrevious, Stop, VolumeDown, VolumeOff, VolumeUp } from '@mui/icons-material';
import { IconButton, Slider, Stack } from '@mui/material';
import { useComputed } from '@preact/signals-react';
import React from 'react';
import { useService } from '../../../context';
import { IMediaPlayerService, IMediaPlayerServiceSymbol } from '../../../services';
import styles from './MediaPlayer.module.scss';

export function MediaPlayerButtons(props: {
	showFullscreen?: boolean;
	additional?: any;
}) {
	const player = useService<IMediaPlayerService>(IMediaPlayerServiceSymbol);

	const fullscreenIcon = useComputed(() => player.fullscreen.value ? <FullscreenExit /> : <Fullscreen />);

	return (
		<div className={styles.controls}>
			{useComputed(() => (
				<IconButton
					onClick={() => player.previous()}
					disabled={player.queueIndex.value <= 0}
				>
					<SkipPrevious />
				</IconButton>
			))}
			<IconButton onClick={() => player.togglePlay()}>
				{useComputed(() => player.playing.value ? <Pause /> : <PlayArrow />)}
			</IconButton>
			{useComputed(() => (
				<IconButton
					onClick={() => player.next()}
					disabled={player.queue.value.length <= player.queueIndex.value + 1}
				>
					<SkipNext />
				</IconButton>
			))}
			<IconButton onClick={() => player.stop()}>
				<Stop />
			</IconButton>
			<div className={styles.spacer} />
			{props.additional}
			<Stack spacing={2} direction="row" sx={{ alignItems: 'center', width: 250 }}>
				<IconButton onClick={() => { player.muted.value = !player.muted.value; }}>
					{useComputed(() => player.muted.value || player.volume.value === 0 ? (
						<VolumeOff />
					) : player.volume.value <= 0.5 ? (
						<VolumeDown />
					) : (
						<VolumeUp />
					))}
				</IconButton>
				{useComputed(() => (
					<Slider
						value={player.volume.value}
						onChange={(_, value) => player.volume.value = value as number}
						min={0}
						max={1}
						step={0.05} />
				))}
			</Stack>
			{props.showFullscreen && (
				<IconButton onClick={() => player.fullscreen.value = !player.fullscreen.value}>
					{fullscreenIcon}
				</IconButton>
			)}
		</div>
	);
}
