import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { IFileInfo } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context';
import { useTranslation } from '../../hooks';
import { IMediaPreferenceService, IMediaPreferenceServiceSymbol } from '../../services';
import { Spacer } from '../atoms/Spacer';

export function DetailViewBar(props: { file: IFileInfo, onClose: () => void; }) {
	const { file, onClose } = props;
	const mediaService = useService<IMediaPreferenceService>(IMediaPreferenceServiceSymbol);
	const _t = useTranslation();

	return (
		<Paper>
			<Stack direction={'row'} sx={{ alignItems: 'center' }} gap={1}>
				<Button onClick={onClose} startIcon={<ArrowBackIcon />}>{_t('Back')}</Button>
				<Typography>{mediaService.getHeader(file)}</Typography>
				<Spacer />
			</Stack>
		</Paper>
	);
}
