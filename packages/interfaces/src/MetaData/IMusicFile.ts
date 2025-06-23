import { IFileInfo, isIFileInfo } from './IFileInfo';
import { ISubtitleMetadata } from './ISubtitleMetadata';

/**
 * A Folder that contains a piece of Music.
 */
export interface IMusicFile extends IFileInfo {
	/**
	 *  The index of the piece of Music.
	 */
	music: IFileInfo;

	/**
	 * The thumbnails of the piece of Music.
	 */
	thumbnails: IFileInfo[];

	/**
	 * The Lyrics of the piece of Music.
	 */
	lyrics?: string;
}

/**
 * Checks whether the specified item is a {@link IMusicFile}.
 * @param item item to check
 * @returns whether the specified item is a {@link IMusicFile}.
 */
export function isIMusicFile(item: any): item is IMusicFile {
	return typeof item.music !== 'undefined' && typeof item.thumbnails?.length === 'number' && isIFileInfo(item);
}
