import LanguageIcon from '@mui/icons-material/Language';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import { Chip } from '@mui/material';
import { isIFolderFile, isIVideoFile, IVideoFile, type IFolderFile, type ISubtitleMetadata } from 'ipmc-interfaces';
import React from 'react';
import styles from './LanguageDisplay.module.css';

export function LanguageDisplay(props: { video: IVideoFile | IFolderFile; }) {
	const { video } = props;

	function getLanguages(file: IVideoFile | IFolderFile): string[] {
		if (isIFolderFile(file)) {
			const childLanguages = file.items.filter(f => isIFolderFile(f) || isIVideoFile(f)).map(f => getLanguages(f)).flat(1);
			return Array.from(new Set(childLanguages));
		}
		return file.languages;
	}

	function getSubtitles(file: IVideoFile | IFolderFile): ISubtitleMetadata[] {
		if (isIFolderFile(file)) {
			const childSubtitles = file.items.filter(f => isIFolderFile(f) || isIVideoFile(f)).map(f => getSubtitles(f)).flat(1);
			return Array.from(new Set(childSubtitles));
		}
		return file.subtitles.filter(s => !s.forced);
	}

	return (
		<div className={styles.container}>
			{getLanguages(video).map(l => (
				<Chip size="small" label={l} key={l} icon={<LanguageIcon />} />
			))}
			{getSubtitles(video).filter(s => !s.forced).map(s => (
				<Chip size="small" label={s.language} key={s.language} icon={<SubtitlesIcon />} />
			))}
		</div>
	);
}
