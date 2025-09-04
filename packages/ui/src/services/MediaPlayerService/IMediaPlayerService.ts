import { IAudioFile, ISubtitleMetadata, IVideoFile } from 'ipmc-interfaces';
import { ReadonlySignal, Signal } from '@preact/signals-react';
import { IPlayerService } from './IPlayerService';

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
	 * Attempt to play the next {@link IFileInfo} in the queue.
	 */
	next(): void;

	/**
	 * Attempt to play the previous {@link IFileInfo} in the queue.
	 */
	previous(): void;

	/**
	 * Registers a new player service to the {@link IMediaPlayerService}.
	 * @param player the {@link IPlayerService} to register.
	 */
	registerPlayer(player: IPlayerService): () => void;

	/**
	 * Attempts to play specified {@link IFileInfo}.
	 * @param file the {@link IFileInfo} to play.
	 */
	play(file: IVideoFile): void;

	enqueueNext(file: IVideoFile): void;
	enqueue(file: IVideoFile): void;

	/**
	 * Stops playback and clears queue.
	 */
	stop(): void;

	/**
	 * Whether or not media is currently playing.
	 */
	playing: Signal<boolean>;

	/**
	 * The currently active queue.
	 */
	queue: Signal<(IVideoFile)[]>;

	/**
	 * The current index in the queue.
	 */
	queueIndex: Signal<number>;

	/**
	 * The currently playing {@link IFileInfo}.
	 */
	nowPlaying: ReadonlySignal<IVideoFile | undefined>;

	/**
	 * Whether the player is open or minimized.
	 */
	open: Signal<boolean>;

	/**
	 * Whether the player is currently loading instead of playing.
	 */
	loading: ReadonlySignal<boolean>;

	/**
	 * Whether the player is currently muted.
	 */
	muted: Signal<boolean>;

	/**
	 * The players current volume (0-1).
	 */
	volume: Signal<number>;

	/**
	 * Whether the player is currently in fullscreen mode.
	 */
	fullscreen: Signal<boolean>;
}
