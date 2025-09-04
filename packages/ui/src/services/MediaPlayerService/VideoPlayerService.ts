import { Signal } from '@preact/signals-react';
import { inject } from 'inversify';
import { IFileInfo, type IIpfsService, IIpfsServiceSymbol, type ILogService, ILogServiceSymbol, isIVideoFile, ISubtitleMetadata, type ITranslationService, ITranslationServiceSymbol } from 'ipmc-interfaces';
import { type IMediaPlayerService, IMediaPlayerServiceSymbol } from './IMediaPlayerService';
import { type IVideoPlayerService } from './IVideoPlayerService';
//@ts-ignore
import shaka from 'shaka-player';

type Request = shaka.extern.Request;
type RequestType = shaka.net.NetworkingEngine.RequestType;
type ProgressUpdated = shaka.extern.ProgressUpdated;
type HeadersReceived = shaka.extern.HeadersReceived;
type SchemePluginConfig = shaka.extern.SchemePluginConfig;

@injectable()
export class VideoPlayerService implements IVideoPlayerService {
	public constructor(
		@inject(IIpfsServiceSymbol) private readonly ipfs: IIpfsService,
		@inject(ILogServiceSymbol) private readonly log: ILogService,
		@inject(IMediaPlayerServiceSymbol) private readonly mediaPlayer: IMediaPlayerService,
		@inject(ITranslationServiceSymbol) private readonly translationService: ITranslationService,
	) {
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

		// Register to {@link IMediaPlayerService}
		this.mediaPlayer.registerPlayer(this);
	}

	public registerVideoElement(el: HTMLVideoElement, container: HTMLElement): () => void {
		this.log.debug('[VideoPlayerService] attaching...');
		this.player.attach(el)
			.then(() => {
				this.log.debug('[VideoPlayerService] attached!');
				this.container = container;


				// Loading state
				el.addEventListener('waiting', () => {
					this.loading.value = true;
				});
				el.addEventListener('stalled', () => {
					this.loading.value = true;
				});
				el.addEventListener('canplay', () => {
					this.loading.value = false;
				});

				// Keep playing the queue once video has ended
				el.addEventListener('ended', () => {
					if (this.mediaPlayer.queue.value.length > this.mediaPlayer.queueIndex.value + 1) {
						this.mediaPlayer.next();
					} else {
						this.mediaPlayer.playing.value = false;
					}
				});
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
			this.player.load(`ipfs://${file.cid}/${file.video.name}`)
				.then(() => {
					if (this.mediaPlayer.playing.peek()) {
						this.videoEl?.play();
					}
				})
				.catch((ex: any) => {
					this.log.error(ex);
				});
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


	public loading = new Signal<boolean>;

	private get videoEl(): HTMLVideoElement | null {
		return this.player.getMediaElement();
	}
	private player: shaka.Player;
	private container: HTMLElement | null;
}
