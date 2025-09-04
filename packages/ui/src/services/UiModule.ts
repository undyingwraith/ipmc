import { IModule } from 'ipmc-core';
import { IMediaPlayerServiceSymbol, IVideoPlayerServiceSymbol, MediaPlayerService, VideoPlayerService } from './MediaPlayerService';
import { IObjectUrlControllerSymbol, ObjectUrlController } from './ObjectUrlController';
import { AudioPlayerService, IAudioPlayerServiceSymbol } from './MediaPlayerService/AudioPlayerService';

export const UiModule: IModule = (app) => {
	app.register(MediaPlayerService, IMediaPlayerServiceSymbol);
	app.register(VideoPlayerService, IVideoPlayerServiceSymbol);
	app.register(AudioPlayerService, IAudioPlayerServiceSymbol);
	app.register(ObjectUrlController, IObjectUrlControllerSymbol);
};
