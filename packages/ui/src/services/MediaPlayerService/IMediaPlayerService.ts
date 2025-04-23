import { Signal } from '@preact/signals-react';
import { ISubtitleMetadata, IVideoFile } from 'ipmc-interfaces';

export const IMediaPlayerServiceSymbol = Symbol.for('MediaPlayerSymbol');

/**
 * Service to controll media playback.
 */
export interface IMediaPlayerService {
	/**
	 * Initializes a video player.
	 * @param el Video element to use.
	 * @param file File to play.
	 */
	initializeVideo(el: HTMLVideoElement, file: IVideoFile): () => void;

	/**
	 * Toggles play state.
	 */
	togglePlay(): void;

	/**
	 * Select a subtitle track.
	 * @param subtitle Subtitle track to use (undefined if none).
	 */
	selectSubtitle(subtitle?: ISubtitleMetadata): void;

	/**
	 * Select a audio language.
	 * @param language language to select.
	 */
	selectLanguage(language: string): void;

	/**
	 * Whether or not media is currently playing.
	 */
	playing: Signal<boolean>;
}
