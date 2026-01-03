import { IFileInfo, isBackdropFeature, isIEpisodeMetadata, isIVideoFile, isPosterFeature, isTitleFeature, isYearFeature } from 'ipmc-interfaces';
import { IMediaPreferenceService } from './IMediaPreferenceService';
import { injectable } from 'inversify';

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
}
