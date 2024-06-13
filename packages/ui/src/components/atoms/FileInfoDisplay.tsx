import { Box, Stack, Typography } from '@mui/material';
import { IFileInfo, isPosterFeature } from 'ipmc-interfaces';
import React from 'react';
import { useProfile } from '../pages/ProfileContext';
import { useTitle } from '../../hooks/useTitle';

export function FileInfoDisplay(props: { file: IFileInfo; }) {
	const { file } = props;
	const { ipfs } = useProfile();
	const name = useTitle(file);
	const title = (
		<Typography variant={'h3'}>{name}</Typography>
	);

	return isPosterFeature(file) && file.posters.length > 0 ? (
		<Stack direction={'row'} spacing={1}>
			<img src={ipfs.toUrl(file.posters[0].cid)} style={{ height: 250, flexGrow: 0 }} />
			{title}
		</Stack>
	) : (
		<Box>
			{title}
		</Box>
	);
}
