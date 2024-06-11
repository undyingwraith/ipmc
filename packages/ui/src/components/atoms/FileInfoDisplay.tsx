import { Box, Stack, Typography } from '@mui/material';
import { IFileInfo, isPosterFeature, isTitleFeature } from 'ipmc-interfaces';
import React from 'react';
import { useApp } from '../pages/AppContext';

export function FileInfoDisplay(props: { file: IFileInfo; }) {
	const { file } = props;
	const { ipfs } = useApp();
	const name = isTitleFeature(file) ? file.title : file.name;
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
