import { batch, Signal } from '@preact/signals-react';
import { inject, injectable } from 'inversify';
import { IFileInfo, type IIpfsService, IIpfsServiceSymbol, type ILogService, ILogServiceSymbol, isIVideoFile, ISubtitleMetadata, type ITranslationService, ITranslationServiceSymbol } from 'ipmc-interfaces';
import { BasePlayerService } from './BasePlayerService';
import { type IVideoPlayerService } from './IVideoPlayerService';
//@ts-ignore
import shaka from 'shaka-player';

type Request = shaka.extern.Request;
type RequestType = shaka.net.NetworkingEngine.RequestType;
type ProgressUpdated = shaka.extern.ProgressUpdated;
type HeadersReceived = shaka.extern.HeadersReceived;
type SchemePluginConfig = shaka.extern.SchemePluginConfig;

@injectable()
export class VideoPlayerService extends BasePlayerService implements IVideoPlayerService {
	public constructor(
		@inject(IIpfsServiceSymbol) private readonly ipfs: IIpfsService,
		@inject(ILogServiceSymbol) private readonly log: ILogService,
		@inject(ITranslationServiceSymbol) private readonly translationService: ITranslationService,
	) {
		super();
		this.shakaPlugin = this.shakaPlugin.bind(this);

		shaka.net.NetworkingEngine.registerScheme('ipfs', this.shakaPlugin, 1, false);

		this.player = new shaka.Player();
		this.player.addEventListener('error', (error: any) => this.log.error(`Error code ${error.code} object ${error}`));
		this.player.configure({
			preferredTextLanguage: this.translationService.language.value,
			preferredAudioLanguage: this.translationService.language.value,
			streaming: {
				alwaysStreamText: true,
				rebufferingGoal: 10,
				bufferingGoal: 60,
			},
		});
		this.translationService.language.subscribe(() => {
			this.player.configure({
				preferredTextLanguage: this.translationService.language.value,
				preferredAudioLanguage: this.translationService.language.value,
			});
		});
	}

	public setCurrentTime(time: number): void {
		if (this.videoEl) {
			this.videoEl.currentTime = time;
		}
	}

	public registerVideoElement(el: HTMLVideoElement, container: HTMLElement): () => void {
		this.log.debug('[VideoPlayerService] attaching...');
		this.player.attach(el)
			.then(() => {
				this.log.debug('[VideoPlayerService] attached!');
				this.container = container;

				// Playback time
				el.addEventListener('timeupdate', () => {
					batch(() => {
						this.currentTime.value = el.currentTime;
						this.bufferedTime.value = (el.buffered.length === 0 ? 0 : el.buffered.end(0));
					});
				});
				el.addEventListener('loadedmetadata', () => {
					this.totalTime.value = el.duration;
				});

				// Loading state
				el.addEventListener('waiting', () => this.emitEvent('waiting'));
				el.addEventListener('stalled', () => this.emitEvent('waiting'));
				el.addEventListener('canplay', () => this.emitEvent('ready'));

				// Keep playing the queue once video has ended
				el.addEventListener('ended', () => this.emitEvent('ended'));
			});

		return () => {
			if (this.videoEl) {
				this.log.debug('[VideoPlayerService] detaching...');
				this.player.detach()
					.then(() => this.log.debug('[VideoPlayerService] detached!'));
			}
			this.container = null;
		};
	}

	public load(file: IFileInfo) {
		if (file != undefined && isIVideoFile(file)) {
			return this.player.load(`ipfs://${file.cid}/${file.video.name}`)
				.catch((ex: any) => {
					this.log.error(ex);
				});
		} else {
			return Promise.reject();
		}
	}

	public selectSubtitle(subtitle?: ISubtitleMetadata) {
		if (subtitle) {
			this.player.selectTextLanguage(subtitle.language, subtitle.role, subtitle.forced);
			this.player.setTextTrackVisibility(true);
		} else {
			this.player.setTextTrackVisibility(false);
		}
	}

	public selectLanguage(language: string) {
		this.player.selectAudioLanguage(language);
	}

	public canPlay(file: IFileInfo): boolean {
		return isIVideoFile(file);
	}

	public play() {
		this.videoEl?.play();
	}

	public pause() {
		this.videoEl?.pause();
	}

	public unload() {
		this.pause();
		this.player.unload();
	}

	public setVolume(volume: number): void {
		if (this.videoEl) {
			this.videoEl.volume = volume;
		}
	}

	public requestFullscreen(): void {
		if (this.container) {
			this.container.requestFullscreen();
		} else if (this.videoEl) {
			this.videoEl.requestFullscreen();
		}
	}

	public currentTime = new Signal(0);
	public bufferedTime = new Signal(0);
	public totalTime = new Signal(0);

	private async shakaPlugin(
		uri: string,
		request: Request,
		requestType: RequestType,
		progressUpdated: ProgressUpdated,
		headersReceived: HeadersReceived,
		config: SchemePluginConfig
	) {
		const fullPath = uri.substring(uri.indexOf('://') + 3);
		const paths = fullPath.split('/');
		const cid = paths.shift()!;
		const path = paths.join('/');

		headersReceived({});

		const data = await this.ipfs.fetch(cid, path);

		return {
			uri: uri,
			originalUri: uri,
			data: data,
			status: 200,
		};
	};

	private get videoEl(): HTMLVideoElement | null {
		return this.player.getMediaElement();
	}

	/**
	 * The {@link shaka.Player} used by this service.
	 */
	private player: shaka.Player;
	/**
	 * The {@link HTMLElement} that contains the {@link HTMLVideoElement}.
	 */
	private container: HTMLElement | null;
}
