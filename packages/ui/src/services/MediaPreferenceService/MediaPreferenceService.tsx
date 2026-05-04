import LiveTvIcon from '@mui/icons-material/LiveTv';
import MovieIcon from '@mui/icons-material/Movie';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { injectable } from 'inversify';
import { IFileInfo, isBackdropFeature, isIAlbumMetadata, isIAudioMetadata, isIEpisodeMetadata, isIMovieMetadata, isISeasonMetadata, isISeriesMetadata, isIVideoFile, isPosterFeature, isTitleFeature, isYearFeature } from 'ipmc-interfaces';
import React from 'react';
import { IMediaPreferenceService } from './IMediaPreferenceService';

@injectable()
export class MediaPreferenceService implements IMediaPreferenceService {
	/**
	 * @inheritdoc
	 */
	getHeader(item: IFileInfo): string {
		return isTitleFeature(item) ? item.title : item.name;
	}

	/**
	 * @inheritdoc
	 */
	getSubheader(item: IFileInfo): string | undefined {
		if (isIEpisodeMetadata(item)) {
			return `S${item.season} E${item.episode}`;
		}
		if (isIAudioMetadata(item)) {
			return `${item.artist} ${item.year} ${item.genre}`;
		}

		if (isIAlbumMetadata(item)) {
			return `${item.artist}`;
		}
		return isYearFeature(item) ? item.year.toString() : undefined;
	}

	/**
	 * @inheritdoc
	 */
	getPoster(item: IFileInfo): IFileInfo | undefined {
		return isPosterFeature(item) && item.posters.length > 0
			? item.posters[0]
			: undefined;
	}

	/**
	 * @inheritdoc
	 */
	getThumbnail(item: IFileInfo): IFileInfo | undefined {
		return isIVideoFile(item) && item.thumbnails.length > 0
			? item.thumbnails[0]
			: isBackdropFeature(item) && item.backdrops.length > 0
				? item.backdrops[0]
				: undefined;
	}

	/**
	 * @inheritdoc
	 */
	getTypeIcon(item: IFileInfo): JSX.Element {
		if (isIMovieMetadata(item)) {
			return (<MovieIcon />);
		}
		if (isISeriesMetadata(item) || isISeasonMetadata(item) || isIEpisodeMetadata(item)) {
			return (<LiveTvIcon />);
		}
		if (isIVideoFile(item)) {
			return (<OndemandVideoIcon />);
		}
		if (isIAudioMetadata(item)) {
			return (<MusicNoteIcon />);
		}
		return (<QuestionMarkIcon />);
	}
}
