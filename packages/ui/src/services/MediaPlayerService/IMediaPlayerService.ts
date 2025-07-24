import { Signal } from '@preact/signals-react';
import { IAudioFile, ISubtitleMetadata, IVideoFile } from 'ipmc-interfaces';

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
	 * Initialize an audio player
	 * @param el Audio element to use.
	 * @param file File to play.
	 */
	initializeAudio(el: HTMLAudioElement, file: IAudioFile): void;

	/**
	 * Toggles play state.
	 */
	togglePlay(): void;

	/**
	 * Jumps the current time by specified amount.
	 * @param amount The amount to jump by in seconds (default: 30).
	 */
	jumpRelative(amount: number): void;

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
