import { batch, computed, effect, Signal } from '@preact/signals-react';
import { inject, injectable } from 'inversify';
import { IFileInfo, type ILogService, ILogServiceSymbol, ISubtitleMetadata, IVideoFile } from 'ipmc-interfaces';
import { IMediaPlayerService } from './IMediaPlayerService';
import { IPlayerService } from './IPlayerService';

@injectable()
export class MediaPlayerService implements IMediaPlayerService {
	public constructor(
		@inject(ILogServiceSymbol) private readonly log: ILogService,
	) {
		// Load current file
		this.nowPlaying.subscribe((file) => {
			if (file != undefined) {
				const player = this.getPlayer(file);
				if (player != undefined) {
					player.load(file);
				} else {
					this.log.error(`No player found for file '${file.name}'`);
				}
			}
		});

		// Set playstate
		this.playing.subscribe((v) => {
			const nowPlaying = this.nowPlaying.peek();
			if (nowPlaying != undefined) {
				const player = this.getPlayer(nowPlaying);
				if (player != undefined) {
					if (v) {
						player.play();
					} else {
						player.pause();
					}
				}
			}
		});

		effect(() => {
			this.currentPlayer.value?.setVolume(this.muted.value ? 0 : this.volume.value);
		});

		effect(() => {
			if (this.fullscreen.value) {
				this.currentPlayer.value?.requestFullscreen();
			} else {
				if (document.fullscreenElement) {
					document.exitFullscreen();
				}

			}
		});
	}

	public registerPlayer(player: IPlayerService): () => void {
		this.players.push(player);

		return () => {
			this.players.splice(this.players.indexOf(player), 1);
		};
	}

	public enqueue(file: IVideoFile): void {
		batch(() => {
			this.queue.value = [...this.queue.value, file];
			if (this.queueIndex.value === -1) {
				this.queueIndex.value = 0;
			}
		});
	}

	public enqueueNext(file: IVideoFile): void {
		this.queue.value = this.queue.peek().toSpliced(this.queueIndex.value + 1, 0, file);
	}

	public play(file: IVideoFile): void {
		this.enqueueNext(file);
		batch(() => {
			this.playing.value = true;
			this.open.value = true;
			this.next();
		});
	}

	public previous(): void {
		if (this.queueIndex.value > 0) {
			this.queueIndex.value -= 1;
		}
	}

	public next(): void {
		if (this.queue.value.length > this.queueIndex.value + 1) {
			this.queueIndex.value += 1;
		}
	}

	public initializeVideo(el: HTMLVideoElement, file: IVideoFile): () => void {
		this.play(file);
		return () => { };
	}

	public togglePlay() {
		this.playing.value = !this.playing.value;
	}

	public stop() {
		batch(() => {
			this.queueIndex.value = -1;
			this.queue.value = [];
			this.open.value = false;
			this.playing.value = false;
		});
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

	public queue = new Signal<(IVideoFile)[]>([]);
	public queueIndex = new Signal<number>(-1);
	public playing = new Signal(false);
	public nowPlaying = computed(() => this.queue.value[this.queueIndex.value]);
	public open: Signal<boolean> = new Signal(false);
	public loading = new Signal(true);
	public muted: Signal<boolean> = new Signal(false);
	public volume: Signal<number> = new Signal(1);
	public fullscreen: Signal<boolean> = new Signal(false);

	private getPlayer(file: IFileInfo): IPlayerService | undefined {
		return this.players.find(p => p.canPlay(file));
	}

	private get videoEl(): HTMLVideoElement | null {
		return null;// this.player.getMediaElement();
	}
	private player: shaka.Player;
	private currentPlayer = computed(() => this.nowPlaying.value ? this.players.find(p => p.canPlay(this.nowPlaying.value)) : undefined);
	private players: IPlayerService[] = [];
}
