import { Button, ListItem, ListItemText, Stack } from '@mui/material';
import { IFileInfo, isIFolderFile, isIVideoFile, isPinFeature, isTitleFeature, isYearFeature } from 'ipmc-interfaces';
import React from 'react';
import { useTranslation } from '../../hooks';
import { EpisodeDisplay, LanguageDisplay, PinButton } from '../atoms';

export function FileListItem(props: { file: IFileInfo; onOpen: () => void; }) {
	const { file } = props;
	const _t = useTranslation();

	return (
		<ListItem
			secondaryAction={
				<Stack direction={'row'}>
					{isIFolderFile(file) && (
						<EpisodeDisplay file={file} />
					)}
					{(isIVideoFile(file) || isIFolderFile(file)) && (
						<LanguageDisplay file={file} />
					)}
					{isPinFeature(file) && <PinButton item={file} />}
					<Button onClick={props.onOpen}>{_t('Open')}</Button>
				</Stack>
			}>
			<ListItemText
				primary={isTitleFeature(file) ? file.title : file.name}
				secondary={isYearFeature(file) ? file.year : undefined}
			/>
		</ListItem>
	);
}
