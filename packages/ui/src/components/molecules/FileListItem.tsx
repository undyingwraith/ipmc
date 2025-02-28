import React from 'react';
import { Button, ListItem, ListItemText } from '@mui/material';
import { IFileInfo, isPinFeature, isTitleFeature, isYearFeature } from 'ipmc-interfaces';
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
			<ListItemText
				primary={isTitleFeature(props.file) && props.file.title}
				secondary={isYearFeature(props.file) && props.file.year}
			/>
		</ListItem>
	);
}
