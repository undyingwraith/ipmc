import { Signal } from '@preact/signals-react';
import { inject, injectable } from 'inversify';
import { type IIpfsService, IIpfsServiceSymbol, type ILogService, ILogServiceSymbol, IAudioFile, isIAudioFile, ISubtitleMetadata, type ITranslationService, ITranslationServiceSymbol, IVideoFile } from 'ipmc-interfaces';
import { IMediaPlayerService } from './IMediaPlayerService';
import { ObjectUrlController } from '../ObjectUrlController';

//@ts-ignore
import shaka from 'shaka-player';

type Request = shaka.extern.Request;
type RequestType = shaka.net.NetworkingEngine.RequestType;
type ProgressUpdated = shaka.extern.ProgressUpdated;
type HeadersReceived = shaka.extern.HeadersReceived;
type SchemePluginConfig = shaka.extern.SchemePluginConfig;

@injectable()
export class MediaPlayerService implements IMediaPlayerService {
	public constructor(
		@inject(IIpfsServiceSymbol) private readonly ipfs: IIpfsService,
		@inject(ILogServiceSymbol) private readonly log: ILogService,
		@inject(ITranslationServiceSymbol) private readonly translationService: ITranslationService,
	) {
		this.shakaPlugin = this.shakaPlugin.bind(this);
		shaka.net.NetworkingEngine.registerScheme('ipfs', this.shakaPlugin, 1, false);
	}

	public initializeVideo(el: HTMLVideoElement, file: IVideoFile): () => void {
		this.videoEl = el;
		const player = new shaka.Player();
		this.player = player;
		player.addEventListener('error', (error: any) => this.log.error(`Error code ${error.code} object ${error}`));
		player.configure({
			preferredTextLanguage: this.translationService.language.value,
			preferredAudioLanguage: this.translationService.language.value,
			streaming: {
				alwaysStreamText: true,
				rebufferingGoal: 10,
				bufferingGoal: 60,
			},
		});
		player.attach(el)
			.then(() => player.load(`ipfs://${file.cid}/${file.video.name}`))
			.catch((ex: any) => {
				this.log.error(ex);
			});

		return () => {
			this.videoEl = undefined;
			this.player = undefined;
			player.unload();
			player.destroy();
			this.playing.value = false;
		};
	}

	public async initializeAudio(el: HTMLAudioElement, file: IAudioFile): Promise<() => void> {
		this.audioEl = el;
		const ObjUrlCont = new ObjectUrlController(this.ipfs);
		const [audioUrl, abort] = ObjUrlCont.getObjectUrl(file.cid);
		const player = new Audio(await audioUrl);
		console.log(file);
		console.log("audio file " + file + " audio path " + file.path + " is audio file: " + isIAudioFile(file));
		this.player = player;
		player.addEventListener('error', (error: any) => this.log.error(`Error code ${error.code} object ${error}`));
		player.play();

		return () => {
			this.audioEl = undefined;
			this.player = undefined;
			this.playing.value = false;
			abort();
		};
	}

	public togglePlay() {
		if (this.videoEl) {
			if (this.playing.value) {
				this.videoEl.pause();
				this.playing.value = false;
			} else {
				this.videoEl?.play()
					.then(() => {
						this.playing.value = true;
					});
			}
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

	public jumpRelative(amount: number) {
		if (this.videoEl) {
			this.videoEl.currentTime = this.videoEl.currentTime + amount;
		}
	}

	public playing = new Signal(false);

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

	private videoEl: HTMLVideoElement | undefined;
	private audioEl: HTMLAudioElement | undefined;
	private player: shaka.Player | undefined;

}
