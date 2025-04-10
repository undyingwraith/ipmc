import React from 'react';
import { Button, Chip, ListItem, ListItemText } from '@mui/material';
import { IFileInfo, isIVideoFile, isPinFeature, isTitleFeature, isYearFeature } from 'ipmc-interfaces';
import { useTranslation } from '../../hooks';
import { PinButton } from '../atoms';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import LanguageIcon from '@mui/icons-material/Language';

export function FileListItem(props: { file: IFileInfo; onOpen: () => void; }) {
	const _t = useTranslation();

	return (
		<ListItem
			secondaryAction={
				<>
					{isIVideoFile(props.file) && (
						<>
							{props.file.languages?.map(l => (
								<Chip size="small" label={l} key={l} icon={<LanguageIcon />} />
							))}
							{props.file.subtitles?.filter(s => !s.forced).map(s => (
								<Chip size="small" label={s.language} key={s.language} icon={<SubtitlesIcon />} />
							))}
						</>
					)}
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
