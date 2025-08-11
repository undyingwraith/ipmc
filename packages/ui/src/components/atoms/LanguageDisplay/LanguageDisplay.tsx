import LanguageIcon from '@mui/icons-material/Language';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import { Chip } from '@mui/material';
import { isIFolderFile, isIVideoFile, IVideoFile, type IFolderFile } from 'ipmc-interfaces';
import React from 'react';
import { LanguageFlagDictionary } from '../../../dictionaries';
import styles from './LanguageDisplay.module.css';

export function LanguageDisplay(props: { file: IVideoFile | IFolderFile; }) {
	const { file } = props;

	function getLanguages(file: IVideoFile | IFolderFile): string[] {
		if (isIFolderFile(file)) {
			const childLanguages = file.items.filter(f => isIFolderFile(f) || isIVideoFile(f)).map(f => getLanguages(f)).flat(1);
			return Array.from(new Set(childLanguages));
		}
		return file.languages;
	}

	function getSubtitles(file: IVideoFile | IFolderFile): string[] {
		if (isIFolderFile(file)) {
			const childSubtitles = file.items.filter(f => isIFolderFile(f) || isIVideoFile(f)).map(f => getSubtitles(f)).flat(1);
			return Array.from(new Set(childSubtitles));
		}
		return file.subtitles.filter(s => !s.forced).map(s => s.language);
	}

	return (
		<div className={styles.container}>
			{getLanguages(file).map(l => (
				<Chip size="small" label={LanguageFlagDictionary.has(l) ? LanguageFlagDictionary.get(l) : l} key={l} icon={<LanguageIcon />} />
			))}
			{getSubtitles(file).map(s => (
				<Chip size="small" label={LanguageFlagDictionary.has(s) ? LanguageFlagDictionary.get(s) : s} key={s} icon={<SubtitlesIcon />} />
			))}
		</div>
	);
}
