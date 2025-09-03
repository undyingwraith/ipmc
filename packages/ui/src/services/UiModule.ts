import { IModule } from 'ipmc-core';
import { IMediaPlayerServiceSymbol, IVideoPlayerServiceSymbol, MediaPlayerService, VideoPlayerService } from './MediaPlayerService';
import { IObjectUrlControllerSymbol, ObjectUrlController } from './ObjectUrlController';

export const UiModule: IModule = (app) => {
	app.register(MediaPlayerService, IMediaPlayerServiceSymbol);
	app.register(VideoPlayerService, IVideoPlayerServiceSymbol);
	app.register(ObjectUrlController, IObjectUrlControllerSymbol);
};
