import { Button, Paper, Stack, Typography } from '@mui/material';
import { Spacer } from '../atoms/Spacer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTitle, useTranslation } from '../../hooks';
import { IFileInfo } from 'ipmc-interfaces';

export function DetailViewBar(props: { file: IFileInfo, onClose: () => void; }) {
	const { file, onClose } = props;
	const _t = useTranslation();
	const title = useTitle(file);

	return (
		<Paper>
			<Stack direction={'row'} sx={{ alignItems: 'center' }} gap={1}>
				<Button onClick={onClose} startIcon={<ArrowBackIcon />}>{_t('Back')}</Button>
				<Typography>{title}</Typography>
				<Spacer />
			</Stack>
		</Paper>
	);
}
