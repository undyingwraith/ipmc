import { Signal } from '@preact/signals-react';
import { inject, injectable } from 'inversify';
import { IFileInfo, type ILogService, ILogServiceSymbol, isIAudioFile } from 'ipmc-interfaces';
import { type IObjectUrlController, IObjectUrlControllerSymbol, ObjectUrlController } from '../ObjectUrlController';
import { IPlayerService } from './IPlayerService';

export const IAudioPlayerServiceSymbol = Symbol.for('AudioPlayerService');

@injectable()
export class AudioPlayerService implements IPlayerService {
	private player: Audio | undefined;

	public constructor(
		@inject(ILogServiceSymbol) private readonly log: ILogService,
		@inject(IObjectUrlControllerSymbol) private readonly urlController: IObjectUrlController,
	) {
		// Register to {@link IMediaPlayerService}
		this.mediaPlayer.registerPlayer(this);


	}



	public load(file: IFileInfo): void {
		const ObjUrlCont = new ObjectUrlController(this.ipfs);
		const [audioUrl, abort] = ObjUrlCont.getObjectUrl(file.cid);
		audioUrl.then((url) => {
			this.player = new Audio(url);
		});
		console.log(file);
		console.log("audio file " + file + " audio path " + file.path + " is audio file: " + isIAudioFile(file));
		this.player.addEventListener('error', (error: any) => this.log.error(`Error code ${error.code} object ${error}`));
	}

	public canPlay(file: IFileInfo): boolean {
		return isIAudioFile(file);
	};

	public play(): void {
		this.player.play();
	}

	public pause(): void {
		this.player.pause();
	}

	public setVolume(volume: number): void {
		this.player.volume = volume;
	}

	public requestFullscreen(): void {

	}

	public loading = new Signal(true);

}
