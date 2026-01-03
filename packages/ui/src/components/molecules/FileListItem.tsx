import { ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import { IFileInfo, isIFolderFile, isIVideoFile } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context';
import { IMediaPreferenceService, IMediaPreferenceServiceSymbol } from '../../services';
import { EpisodeDisplay, LanguageDisplay } from '../atoms';
import { MediaItemActions } from './MediaItemActions';

export function FileListItem(props: {
	file: IFileInfo;
	onOpen: () => void;
	actions?: JSX.Element;
	selected?: boolean;
	style?: any;
}) {
	const { file, onOpen, selected, style } = props;
	const mediaService = useService<IMediaPreferenceService>(IMediaPreferenceServiceSymbol);
	const actions = props.actions ?? (<MediaItemActions file={file} />);

	return (
		<div style={{
			...style,
			borderBottom: '1px solid gray'
		}}>
			<ListItem
				secondaryAction={
					<Stack direction={'row'}>
						{isIFolderFile(file) && (
							<EpisodeDisplay file={file} />
						)}
						{(isIVideoFile(file) || isIFolderFile(file)) && (
							<LanguageDisplay file={file} />
						)}
						{actions}
					</Stack>
				}>
				<ListItemButton
					onClick={onOpen}
					selected={selected}
				>
					<ListItemText
						primary={mediaService.getHeader(file)}
						secondary={mediaService.getSubheader(file)}
					/>
				</ListItemButton>
			</ListItem>
		</div>
	);
}
