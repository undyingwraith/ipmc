import LiveTvIcon from '@mui/icons-material/LiveTv';
import MovieIcon from '@mui/icons-material/Movie';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import React from 'react';

export const LibraryTypeDictionary: {
	unknown: JSX.Element;
	[key: string]: JSX.Element;
} = {
	movie: <MovieIcon />,
	series: <LiveTvIcon />,
	music: <MusicNoteIcon />,
	unknown: <QuestionMarkIcon />,
};
