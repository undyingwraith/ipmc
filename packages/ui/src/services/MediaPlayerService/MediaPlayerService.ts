import { Signal } from '@preact/signals';
import { inject, injectable } from 'inversify';
import { type IIpfsService, IIpfsServiceSymbol, type ILogService, ILogServiceSymbol, IVideoFile } from 'ipmc-interfaces';
import { IMediaPlayerService } from './IMediaPlayerService';
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
			streaming: {
				rebufferingGoal: 5,
				bufferingGoal: 30,
			}
		});
		player.attach(el)
			.then(() => player.load(`ipfs://${file.cid}/${file.video.name}`))
			.then(() => {
				this.subtitles.value = player.getTextTracks();
				this.languages.value = player.getAudioLanguages();
			})
			.catch((ex: any) => {
				this.log.error(ex);
			});

		return () => {
			this.languages.value = [];
			this.subtitles.value = [];
			this.videoEl = undefined;
			this.player = undefined;
			player.unload();
			player.destroy();
			this.playing.value = false;
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

	public selectSubtitle(trackName?: string) {
		if (trackName) {
			this.player.value.selectTextTrack(trackName);
			this.player.value.setTextTrackVisibility(true);
		} else {
			this.player.value.setTextTrackVisibility(false);
		}

	}

	public languages = new Signal([]);

	public subtitles = new Signal([]);

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
	private player: shaka.Player | undefined;
}
