export type TStream = 'Video' | 'Audio' | 'Text';

export interface IStream {
	type: TStream;
	id: number;
	lang?: string;
	file: string;
	forced?: boolean;
}
