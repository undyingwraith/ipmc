import { IFileInfo, isIFileInfo } from './IFileInfo';
import { ISubtitleMetadata } from './ISubtitleMetadata';

/**
 * A folder that contains a video.
 */
export interface IVideoFile extends IFileInfo {
	/**
	 * The index file of the video.
	 */
	video: IFileInfo;

	/**
	 * The thumbnails of the video.
	 */
	thumbnails: IFileInfo[];

	/**
	 * The languages of the video.
	 */
	languages: string[];

	/**
	 * The subtitles of the video.
	 */
	subtitles: ISubtitleMetadata[];

	/**
	 * Duration of the video as a formatted string.
	 */
	duration: number;

	/**
	 * Height in pixels of the video.
	 */
	resolution: number;
}

/**
 * Checks whether the specified item is a {@link IVideoFile}.
 * @param item item to check.
 * @returns whether the specified item is a {@link IVideoFile}.
 */
export function isIVideoFile(item: any): item is IVideoFile {
	return typeof item !== 'undefined' && typeof item.video !== 'undefined' && typeof item.thumbnails?.length === 'number' && isIFileInfo(item);
}
