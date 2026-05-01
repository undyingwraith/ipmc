import { Chip, Stack } from '@mui/material';
import { isIFolderFile, isISeriesMetadata, type IFolderFile } from 'ipmc-interfaces';
import React from 'react';
import { useTranslation } from '../../hooks';

export function EpisodeDisplay(props: { file: IFolderFile; }) {
	const { file } = props;
	const _t = useTranslation();

	return (
		<Stack direction={'row'} spacing={1}>
			{isISeriesMetadata(file) && <Chip size={'small'} label={_t('Seasons', { amount: file.items.length.toString() })} />}
			<Chip size={'small'} label={_t('Episodes', {
				amount: (isISeriesMetadata(file) ? file.items.map(i => isIFolderFile(i) ? i.items.length : 0).reduce((total, v) => total + v) : file.items.length).toString()
			})} />
		</Stack>
	);
}
