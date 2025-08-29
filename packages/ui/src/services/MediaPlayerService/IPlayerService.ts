import { ReadonlySignal } from '@preact/signals-react';
import { IFileInfo } from 'ipmc-interfaces';

export interface IPlayerService {
	/**
	 * Loads specified {@link IFileInfo} for playing.
	 * @param file The {@link IFileInfo} to load.
	 */
	load(file: IFileInfo): void;

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
	 * Sets the volume for the player.
	 * @param volume The volume to set (0-1).
	 */
	setVolume(volume: number): void;

	/**
	 * Request fullscreen for this player.
	 */
	requestFullscreen(): void;

	/**
	 * Whether the media is loading.
	 */
	loading: ReadonlySignal<boolean>;
}
