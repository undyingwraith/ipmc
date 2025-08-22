import { ISubtitleMetadata } from 'ipmc-interfaces';
import { IPlayerService } from './IPlayerService';

export const IVideoPlayerServiceSymbol = Symbol.for('IVideoPlayerService');

export interface IVideoPlayerService extends IPlayerService {
	/**
	 * Registers a {@link HTMLVideoElement} to be used by the service.
	 * @param el {@link HTMLVideoElement} to register.
	 * @param container {@link HTMLElement} to register as container for fullscreen.
	 */
	registerVideoElement(el: HTMLVideoElement, container?: HTMLElement): () => void;

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
}
