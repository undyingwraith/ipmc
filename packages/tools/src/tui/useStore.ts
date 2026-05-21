import { create } from 'zustand';
import { type IStream } from './IStream';

export interface IMovieMetadata {
	year: string;
	title: string;
}

export interface IEpisodeMetadata {
	seriesTitle: string;
	season: string;
	episode: string;
	episodeTitle?: string;
}

type TMetadata = ({ type: 'movie'; } & IMovieMetadata) | ({ type: 'episode'; } & IEpisodeMetadata);

export const useStore = create<{
	metadata: TMetadata,
	streams: IStream[],
	setMetadata: (metadata: TMetadata) => void,
	setStreams: (streams: IStream[]) => void,
}>((set) => ({
	metadata: {
		type: 'movie',
		title: '',
		year: '',
	},
	streams: [],
	setMetadata: (metadata: TMetadata) => {
		set({ metadata });
	},
	setStreams: (streams: IStream[]) => {
		set({ streams });
	}
}));
