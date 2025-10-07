import { batch, computed, effect, Signal } from '@preact/signals-react';
import { inject, injectable, multiInject } from 'inversify';
import { IFileInfo, type ILogService, ILogServiceSymbol, IVideoFile } from 'ipmc-interfaces';
import { IMediaPlayerService } from './IMediaPlayerService';
import { IPlayerService, IPlayerServiceSymbol } from './IPlayerService';

@injectable()
export class MediaPlayerService implements IMediaPlayerService {
	public constructor(
		@inject(ILogServiceSymbol) private readonly log: ILogService,
		@multiInject(IPlayerServiceSymbol) private readonly players: IPlayerService[]
	) {
		// Load current file
		this.nowPlaying.subscribe((file) => {
			if (file != undefined) {
				const player = this.getPlayer(file);
				if (player != undefined) {
					player.load(file)
						.then(() => {
							if (this.playing.peek()) {
								player.play();
							}
						});
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

		for (const player of this.players) {
			player.addEventListener('ended', () => {
				this.next();
			});

			player.addEventListener('ready', () => {
				this.loading.value = false;
			});

			player.addEventListener('waiting', () => {
				this.loading.value = true;
			});
		}
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

	public togglePlay() {
		this.playing.value = !this.playing.value;
	}

	public stop() {
		this.currentPlayer.value?.pause();
		batch(() => {
			this.queueIndex.value = -1;
			this.queue.value = [];
			this.open.value = false;
			this.playing.value = false;
		});
	}

	public jumpRelative(amount: number) {
		const player = this.currentPlayer.value;
		if (player) {
			player.setCurrentTime(player.currentTime.value + amount);
		}
	}

	public setCurrentTime(amount: number) {
		const player = this.currentPlayer.value;
		if (player) {
			player.setCurrentTime(amount);
		}
	}

	public queue = new Signal<(IVideoFile)[]>([]);
	public queueIndex = new Signal<number>(-1);
	public playing = new Signal(false);
	public nowPlaying = computed(() => this.queue.value[this.queueIndex.value]);
	public open: Signal<boolean> = new Signal(false);
	public loading = new Signal(true);
	public currentTime = computed<number>(() => this.currentPlayer.value?.currentTime.value ?? 0);
	public bufferedTime = computed<number>(() => this.currentPlayer.value?.bufferedTime.value ?? 0);
	public totalTime = computed<number>(() => this.currentPlayer.value?.totalTime.value ?? 0);
	public muted: Signal<boolean> = new Signal(false);
	public volume: Signal<number> = new Signal(1);
	public fullscreen: Signal<boolean> = new Signal(false);

	private getPlayer(file: IFileInfo): IPlayerService | undefined {
		return this.players.find(p => p.canPlay(file));
	}

	private currentPlayer = computed(() => this.nowPlaying.value ? this.players.find(p => p.canPlay(this.nowPlaying.value)) : undefined);
}
