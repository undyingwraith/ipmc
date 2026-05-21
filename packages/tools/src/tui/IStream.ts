export type TStream = 'video' | 'audio' | 'subtitle';

export interface IStream {
	type: TStream;
	id: number;
	lang?: string;
	file: string;
	role?: string;
}
