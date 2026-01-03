import { useComputed } from '@preact/signals-react';
import React from 'react';
import { useService } from '../../../context';
import { IMediaPlayerService, IMediaPlayerServiceSymbol, IVideoPlayerService, IVideoPlayerServiceSymbol } from '../../../services';
import { isIVideoFile } from 'ipmc-interfaces';

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
					{useComputed(() => {
						const file = mediaPlayer.nowPlaying.value;
						if (isIVideoFile(file)) {
							return file.languages.map(l => (
								<option>{l}</option>
							));
						}
						return undefined;
					})}
				</select>
			</div>
			<div>
				<span>Subtitle</span>
				<select onChange={(ev) => {
					videoPlayer.selectSubtitle(ev.currentTarget.value !== 'null' ? JSON.parse(ev.currentTarget.value) : undefined);
				}}>
					<option value="null">None</option>
					{useComputed(() => {
						const file = mediaPlayer.nowPlaying.value;
						if (isIVideoFile(file)) {
							return file.subtitles.map(s => (
								<option value={JSON.stringify(s)}>{s.language} - {s.role}</option>
							));
						}
						return undefined;
					})}
				</select>
			</div>
		</>
	);
}
