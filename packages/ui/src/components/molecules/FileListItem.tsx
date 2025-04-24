import { Button, ListItem, ListItemText } from '@mui/material';
import { IFileInfo, isIVideoFile, isPinFeature, isTitleFeature, isYearFeature } from 'ipmc-interfaces';
import React from 'react';
import { useTranslation } from '../../hooks';
import { LanguageDisplay, PinButton } from '../atoms';

export function FileListItem(props: { file: IFileInfo; onOpen: () => void; }) {
	const _t = useTranslation();

	return (
		<ListItem
			secondaryAction={
				<>
					{isIVideoFile(props.file) && (<LanguageDisplay video={props.file} />)}
					{isPinFeature(props.file) && <PinButton item={props.file} />}
					<Button onClick={props.onOpen}>{_t('Open')}</Button>
				</>

			}>
			<ListItemText
				primary={isTitleFeature(props.file) ? props.file.title : props.file.name}
				secondary={isYearFeature(props.file) ? props.file.year : undefined}
			/>
		</ListItem>
	);
}
