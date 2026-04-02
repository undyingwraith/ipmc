import { batch, Signal } from '@preact/signals-react';
import { inject, injectable } from 'inversify';
import { IFileInfo, type ILogService, ILogServiceSymbol, isIAudioFile } from 'ipmc-interfaces';
import { type IObjectUrlController, IObjectUrlControllerSymbol } from '../ObjectUrlController';
import { IPlayerService, TEvent } from './IPlayerService';

export const IAudioPlayerServiceSymbol = Symbol.for('AudioPlayerService');

@injectable()
export class AudioPlayerService implements IPlayerService {
	private player: HTMLAudioElement | undefined;

	public constructor(
		@inject(ILogServiceSymbol) private readonly log: ILogService,
		@inject(IObjectUrlControllerSymbol) private readonly urlController: IObjectUrlController,
	) {
		this.log.debug("AudioPlayerService called");
	}

	addEventListener(ev: TEvent, emit: () => void): void {
		//throw new Error('Method not implemented.');
	}

	public currentTime = new Signal(0);
	public bufferedTime = new Signal(0);
	public totalTime = new Signal(0);

	public updateTimes() {
		if (this.player?.currentTime) {
			this.currentTime.value = this.player?.currentTime;
		}
		if (this.player?.duration) {
			this.bufferedTime.value = this.player?.duration;
			this.totalTime.value = this.player?.duration;
		}
	}


	public async load(file: IFileInfo): Promise<void> {
		const [audioUrl, _] = this.urlController.getObjectUrl(file.cid);
		const url = await audioUrl;
		if (this.player) {
			this.player.pause();
		}
		this.player = new Audio(url);
		this.player.addEventListener('timeupdate', () => {
			batch(() => {
				this.updateTimes();
			});
		});

		this.currentTime;

		console.log(file);
		console.log("audio file " + file + " audio path " + file.path + " is audio file: " + isIAudioFile(file));
		this.player.addEventListener('error', (error: any) => this.log.error(`Error code ${error.code} object ${error}`));
	}

	public setCurrentTime(time: number): void {
		if (this.player) {
			this.player.currentTime = time;
		}
	}

	public canPlay(file: IFileInfo): boolean {
		return isIAudioFile(file);
	};

	public play(): void {
		this.player?.play();
	}

	public pause(): void {
		this.player?.pause();
	}

	public unload(): void {
		this.pause();
		this.player = undefined;
	}

	public setVolume(volume: number): void {
		if (this.player) {
			this.player.volume = volume;
		}
	}

	public requestFullscreen(): void {

	}

	public loading = new Signal(true);

}
