import { Application, IModule } from 'ipmc-core';
import { IMediaPlayerServiceSymbol, IPlayerServiceSymbol, IVideoPlayerServiceSymbol, MediaPlayerService, VideoPlayerService } from './MediaPlayerService';
import { IObjectUrlControllerSymbol, ObjectUrlController } from './ObjectUrlController';
import { AudioPlayerService, IAudioPlayerServiceSymbol } from './MediaPlayerService/AudioPlayerService';

export const UiModule: IModule = (app: Application) => {
	app.register(ObjectUrlController, IObjectUrlControllerSymbol);

	// Media players
	app.register(MediaPlayerService, IMediaPlayerServiceSymbol);
	app.register(VideoPlayerService, IVideoPlayerServiceSymbol);
	app.register(AudioPlayerService, IAudioPlayerServiceSymbol);
	app.registerConstantMultiple(app.getService(IVideoPlayerServiceSymbol), IPlayerServiceSymbol);
};
