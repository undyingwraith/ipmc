import { Box, Stack, Typography } from '@mui/material';
import { useComputed } from '@preact/signals';
import { IFileInfo, isPosterFeature } from 'ipmc-interfaces';
import { useFileUrl } from '../../hooks';
import { useTitle } from '../../hooks/useTitle';

export function FileInfoDisplay(props: { file: IFileInfo; }) {
	const { file } = props;
	const name = useTitle(file);
	const title = (
		<Typography variant={'h3'}>{name}</Typography>
	);
	const posterUrl = useFileUrl(isPosterFeature(file) && file.posters.length > 0 ? file.posters[0]?.cid : undefined);

	return isPosterFeature(file) && file.posters.length > 0 ? (
		<Stack direction={'row'} spacing={1}>
			{useComputed(() => (<img src={posterUrl.value} style={{ height: 250, flexGrow: 0 }} />))}
			{title}
		</Stack>
	) : (
		<Box>
			{title}
		</Box>
	);
}
