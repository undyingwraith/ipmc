import { useComputed } from '@preact/signals-react';
import React from 'react';
import { useService } from '../../../context';
import { IMediaPlayerService, IMediaPlayerServiceSymbol, IVideoPlayerService, IVideoPlayerServiceSymbol } from '../../../services';

export function VideoPlayerButtons() {
	const videoPlayer = useService<IVideoPlayerService>(IVideoPlayerServiceSymbol);
	const mediaPlayer = useService<IMediaPlayerService>(IMediaPlayerServiceSymbol);

	return (
		<>
			<div>
				<span>Language</span>
				<select onChange={(ev) => {
					videoPlayer.selectLanguage(ev.currentTarget.value);
				}}>
					{useComputed(() => mediaPlayer.nowPlaying.value?.languages?.map(l => (
						<option>{l}</option>
					)))}
				</select>
			</div>
			<div>
				<span>Subtitle</span>
				<select onChange={(ev) => {
					videoPlayer.selectSubtitle(ev.currentTarget.value !== 'null' ? JSON.parse(ev.currentTarget.value) : undefined);
				}}>
					<option value="null">None</option>
					{useComputed(() => mediaPlayer.nowPlaying.value?.subtitles?.map(s => (
						<option value={JSON.stringify(s)}>{s.language}{s.forced && ' - forced'}</option>
					)))}
				</select>
			</div>
		</>
	);
}
