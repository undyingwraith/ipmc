import { Button, ButtonGroup } from '@mui/material';
import { IFileInfo, isPinFeature } from 'ipmc-interfaces';
import React from 'react';
import { useTranslation } from '../../hooks';
import { PinButton } from '../atoms';

export function MediaItemActions(props: { file: IFileInfo; onOpen: () => void; }) {
	const { file, onOpen } = props;

	const _t = useTranslation();

	return (
		<ButtonGroup variant={'text'}>
			{isPinFeature(file) && <PinButton item={file} />}
			{<Button onClick={onOpen}>{_t('Open')}</Button>}
		</ButtonGroup>
	);
}
