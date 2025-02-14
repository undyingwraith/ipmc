import { Signal } from '@preact/signals';
import { IVideoFile } from 'ipmc-interfaces';

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
	 * @param trackName Subtitle track to use (undefined if none).
	 */
	selectSubtitle(trackName?: string): void;

	/**
	 * Available languages, only available for videos.
	 */
	languages: Signal<any[]>;

	/**
	 * Available subtitles, only available for videos.
	 */
	subtitles: Signal<any[]>;

	/**
	 * Whether or not media is currently playing.
	 */
	playing: Signal<boolean>;
}
