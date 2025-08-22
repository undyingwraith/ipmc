import { ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import { IFileInfo, isIEpisodeMetadata, isIFolderFile, isIVideoFile, isTitleFeature, isYearFeature } from 'ipmc-interfaces';
import React from 'react';
import { EpisodeDisplay, LanguageDisplay } from '../atoms';
import { MediaItemActions } from './MediaItemActions';

export function FileListItem(props: { file: IFileInfo; onOpen: () => void; }) {
	const { file, onOpen } = props;

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
					<MediaItemActions file={file} />
				</Stack>
			}>
			<ListItemButton onClick={onOpen}>
				<ListItemText
					primary={isTitleFeature(file) ? file.title : file.name}
					secondary={isYearFeature(file) ? file.year : isIEpisodeMetadata(file) ? `${file.series} - S${file.season} E${file.episode}` : undefined}
				/>
			</ListItemButton>
		</ListItem>
	);
}
