import { AddToQueue, PlayArrow, QueuePlayNext } from '@mui/icons-material';
import { Button, ButtonGroup } from '@mui/material';
import { batch } from '@preact/signals-react';
import { IFileInfo, IFolderFile, isIFolderFile, isISeasonMetadata, isISeriesMetadata, isIVideoFile, isPinFeature } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context';
import { useTranslation } from '../../hooks';
import { IMediaPlayerService, IMediaPlayerServiceSymbol } from '../../services';
import { PinButton } from '../atoms';

export function MediaItemActions(props: { file: IFileInfo; fullwidth?: boolean; variant?: 'icons' | 'full'; }) {
	const { file, fullwidth } = props;
	const text = props.variant === 'full';

	const _t = useTranslation();
	const player = useService<IMediaPlayerService>(IMediaPlayerServiceSymbol);

	function enqueueAll(file: IFolderFile) {
		for (const item of file.items) {
			if (isIFolderFile(item)) {
				enqueueAll(item);
			} else if (isIVideoFile(item)) {
				player.enqueue(item);
			}
		}
	}

	const enqueueButton = isIVideoFile(file) ? (
		<Button
			title={_t('AddToQueue').value}
			onClick={() => player.enqueue(file)}
			endIcon={text && _t('AddToQueue')}
		>
			<AddToQueue />
		</Button>
	) : isISeriesMetadata(file) || isISeasonMetadata(file) ? (
		<Button
			title={_t('AddToQueue').value}
			onClick={() => {
				enqueueAll(file);
			}}
			endIcon={text && _t('AddToQueue')}
		>
			<AddToQueue />
		</Button>
	) : undefined;

	const enqueueNextButton = player.canPlay(file) ? (
		<Button
			title={_t('EnqueueNext').value}
			onClick={() => player.enqueueNext(file)}
			endIcon={text && _t('EnqueueNext')}
		>
			<QueuePlayNext />
		</Button>
	) : undefined;

	const playButton = player.canPlay(file) ? (
		<Button
			title={_t('Play').value}
			onClick={() => player.play(file)}
			endIcon={text && _t('Play')}
		>
			<PlayArrow />
		</Button>
	) : isISeriesMetadata(file) || isISeasonMetadata(file) ? (
		<Button
			title={_t('Play').value}
			onClick={() => {
				enqueueAll(file);
				batch(() => {
					player.playing.value = true;
					player.open.value = true;
				});
			}}
			endIcon={text && _t('Play')}
		>
			<PlayArrow />
		</Button>
	) : undefined;

	return (
		<ButtonGroup variant={text ? 'contained' : 'text'} fullWidth={fullwidth}>
			{isPinFeature(file) && <PinButton item={file} />}
			{enqueueButton}
			{enqueueNextButton}
			{playButton}
		</ButtonGroup>
	);
}
