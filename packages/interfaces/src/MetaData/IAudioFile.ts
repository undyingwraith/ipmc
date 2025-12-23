import { IFileInfo, isIFileInfo } from './IFileInfo';
import { ISubtitleMetadata } from './ISubtitleMetadata';

/**
 * A Folder that contains a piece of Music.
 */
export interface IAudioFile extends IFileInfo {
	/**
	 * The cover of the piece of Music.
	 */
	cover: IFileInfo[];

	/**
	 * The Lyrics of the piece of Music.
	 */
	lyrics?: string;
}

/**
 * Checks whether the specified item is a {@link IAudioFile}.
 * @param item item to check
 * @returns whether the specified item is a {@link IAudioFile}.
 */
export function isIAudioFile(item: any): item is IAudioFile {
	if (item.name) {
		if (item.name.endsWith(".mp3")) {
			return true;
		}
	}
	return false;
	//return typeof item.thumbnails?.length === 'number' && isIFileInfo(item);
}
