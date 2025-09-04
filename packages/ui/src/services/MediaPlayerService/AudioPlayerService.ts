import { Signal } from '@preact/signals-react';
import { inject } from 'inversify';
import { IFileInfo, type IIpfsService, IIpfsServiceSymbol, type ILogService, ILogServiceSymbol, isIAudioFile } from 'ipmc-interfaces';
import { IMediaPlayerService, IMediaPlayerServiceSymbol } from './IMediaPlayerService';
import { ObjectUrlController } from '../ObjectUrlController';

@injectable()
export class AudioPlayerService implements IMediaPlayerService {
	public constructor(
		@inject(ILogServiceSymbol) private readonly log: ILogService,
	) {

		// Register to {@link IMediaPlayerService}
		this.mediaPlayer.registerPlayer(this);
	}


	public load(file: IFileInfo): void {
		const ObjUrlCont = new ObjectUrlController(this.ipfs);
		const [audioUrl, abort] = ObjUrlCont.getObjectUrl(file.cid);
		const player = new Audio(await audioUrl);

		console.log(file);
		console.log("audio file " + file + " audio path " + file.path + " is audio file: " + isIAudioFile(file));

		player.addEventListener('error', (error: any) => this.log.error(`Error code ${error.code} object ${error}`));
		player.play();
	}

	public canPlay(file: IFileInfo): boolean {
		return true;
	};

}
