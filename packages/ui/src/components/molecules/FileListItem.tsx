import React from 'react';
import { Button, ListItem, ListItemText } from '@mui/material';
import { IFileInfo, isPinFeature } from 'ipmc-interfaces';
import { useTranslation } from '../../hooks';
import { PinButton } from '../atoms';

export function FileListItem(props: { file: IFileInfo; onOpen: () => void; }) {
	const _t = useTranslation();

	return (
		<ListItem
			secondaryAction={
				<>
					{isPinFeature(props.file) && <PinButton item={props.file} />}
					<Button onClick={props.onOpen}>{_t('Open')}</Button>
				</>

			}>
			<ListItemText>{props.file.name}</ListItemText>
		</ListItem>
	);
}
