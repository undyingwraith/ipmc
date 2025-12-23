import { IFileInfo, IVideoFile } from 'ipmc-interfaces';
import { ReadonlySignal, Signal } from '@preact/signals-react';

export const IMediaPlayerServiceSymbol = Symbol.for('MediaPlayerSymbol');

/**
 * Service to controll media playback.
 */
export interface IMediaPlayerService {
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
	 * Attempts to play specified {@link IFileInfo}.
	 * @param file the {@link IFileInfo} to play.
	 */
	play(file: IFileInfo): void;

	/**
	 * Set the current playback time.
	 */
	setCurrentTime(time: number): void;

	enqueue(file: IFileInfo): void;

	enqueueNext(file: IFileInfo): void;

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
	queue: Signal<IFileInfo[]>;

	/**
	 * The current index in the queue.
	 */
	queueIndex: Signal<number>;

	/**
	 * The currently playing {@link IFileInfo}.
	 */
	nowPlaying: ReadonlySignal<IFileInfo | undefined>;

	/**
	 * Whether the player is open or minimized.
	 */
	open: Signal<boolean>;

	/**
	 * Whether the player is currently loading instead of playing.
	 */
	loading: ReadonlySignal<boolean>;

	currentTime: ReadonlySignal<number>;

	bufferedTime: ReadonlySignal<number>;

	totalTime: ReadonlySignal<number>;

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

	/**
	 * Checks whether this service can play a {@link IFileInfo}.
	 * @param file {@link IFileInfo} to check for playability.
	 */
	canPlay(file: IFileInfo): boolean;
}
