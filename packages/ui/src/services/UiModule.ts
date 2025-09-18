import { Application, IModule } from 'ipmc-core';
import { GlobalSearchService, IGlobalSearchServiceSymbol } from './GlobalSearchService';
import { IMediaPlayerServiceSymbol, IPlayerServiceSymbol, IVideoPlayerServiceSymbol, MediaPlayerService, VideoPlayerService } from './MediaPlayerService';
import { IObjectUrlControllerSymbol, ObjectUrlController } from './ObjectUrlController';

export const UiModule: IModule = (app: Application) => {
	app.register(ObjectUrlController, IObjectUrlControllerSymbol);
	app.register(GlobalSearchService, IGlobalSearchServiceSymbol);

	// Media players
	app.register(MediaPlayerService, IMediaPlayerServiceSymbol);
	app.register(VideoPlayerService, IVideoPlayerServiceSymbol);
	app.registerConstantMultiple(app.getService(IVideoPlayerServiceSymbol), IPlayerServiceSymbol);
};
