import { ReadonlySignal } from '@preact/signals-react';
import { IFileInfo } from 'ipmc-interfaces';

export const IPlayerServiceSymbol = Symbol.for('IPlayerService');

export interface IPlayerService {
	/**
	 * Loads specified {@link IFileInfo} for playing.
	 * @param file The {@link IFileInfo} to load.
	 */
	load(file: IFileInfo): Promise<void>;

	/**
	 * Checks whether this service can play a {@link IFileInfo}.
	 * @param file {@link IFileInfo} to check for playability.
	 */
	canPlay(file: IFileInfo): boolean;

	/**
	 * Starts playback.
	 */
	play(): void;

	/**
	 * Pauses playback.
	 */
	pause(): void;

	/**
	 * Stops playback unloads media.
	 */
	unload(): void;

	/**
	 * Sets the volume for the player.
	 * @param volume The volume to set (0-1).
	 */
	setVolume(volume: number): void;

	/**
	 * Request fullscreen for this player.
	 */
	requestFullscreen(): void;

	/**
	 * Set the current playback time.
	 */
	setCurrentTime(time: number): void;

	/**
	 * Adds a new event listener for specified event.
	 * @param ev event to listen for, {@see TEvent}.
	 * @param emit 
	 */
	addEventListener(ev: TEvent, emit: () => void): void;

	/**
	 * The current time in the media item in seconds.
	 */
	currentTime: ReadonlySignal<number>;

	/**
	 * The buffered time in the media item in seconds.
	 */
	bufferedTime: ReadonlySignal<number>;

	/**
	 * The total time in the media item in seconds.
	 */
	totalTime: ReadonlySignal<number>;
}

/**
 * ended - Media has finished playing.
 * waiting - Media can currently not play as its loading etc.
 * ready - Media is ready to be played.
 */
export type TEvent = 'ended' | 'waiting' | 'ready';
