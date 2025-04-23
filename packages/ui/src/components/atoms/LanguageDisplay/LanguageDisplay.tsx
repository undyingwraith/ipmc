import LanguageIcon from '@mui/icons-material/Language';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import { Chip } from '@mui/material';
import { IVideoFile } from 'ipmc-interfaces';
import React from 'react';
import styles from './LanguageDisplay.module.css';

export function LanguageDisplay(props: { video: IVideoFile; }) {
	const { video } = props;

	return (
		<div className={styles.container}>
			{video.languages?.map(l => (
				<Chip size="small" label={l} key={l} icon={<LanguageIcon />} />
			))}
			{video.subtitles?.filter(s => !s.forced).map(s => (
				<Chip size="small" label={s.language} key={s.language} icon={<SubtitlesIcon />} />
			))}
		</div>
	);
}
