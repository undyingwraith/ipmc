import { useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { IIpfsService, IIpfsServiceSymbol, IVideoFile } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context';
import { useHotkey } from '../../hooks';
//@ts-ignore
import shaka from 'shaka-player';

function createShakaIpfsPlugin(ipfs: IIpfsService): shaka.extern.SchemePlugin {
	return async (uri: string, request: shaka.extern.Request, requestType: shaka.net.NetworkingEngine.RequestType, progressUpdated: shaka.extern.ProgressUpdated, headersReceived: shaka.extern.HeadersReceived, config: shaka.extern.SchemePluginConfig) => {
		const fullPath = uri.substring(uri.indexOf('://') + 3);
		const paths = fullPath.split('/');
		const cid = paths.shift()!;
		const path = paths.join('/');

		headersReceived({});

		const data = await ipfs.fetch(cid, path);

		return {
			uri: uri,
			originalUri: uri,
			data: data,
			status: 200,
		};
	};
}

export function VideoPlayer(props: { file: IVideoFile; }) {
	const ipfs = useService<IIpfsService>(IIpfsServiceSymbol);
	const videoRef = useSignal<HTMLVideoElement | null>(null);
	const playerRef = useSignal<any | null>(null);
	const subtitles = useSignal<any[]>([]);
	const languages = useSignal<string[]>([]);

	useHotkey({ key: 'F' }, () => {
		videoRef.value?.requestFullscreen();
	});

	useSignalEffect(() => {
		if (videoRef.value != null) {
			shaka.net.NetworkingEngine.registerScheme('ipfs', createShakaIpfsPlugin(ipfs), 1, false);
			const player = new shaka.Player();
			player.configure({
				streaming: {
					rebufferingGoal: 5,
					bufferingGoal: 30,
				}
			});
			playerRef.value = player;
			player.attach(videoRef.value)
				.then(() => player.load(`ipfs://${props.file.cid}/${props.file.video.name}`))
				.then(() => {
					subtitles.value = player.getTextTracks();
					languages.value = player.getAudioLanguages();
				})
				.catch((ex: any) => {
					console.error(ex);
				});

			return () => {
				player.unload();
				player.destroy();
			};
		}

		return () => { };
	});

	return (
		<div>
			<video
				controls
				style={{ height: '85vh', maxWidth: '100%', maxHeight: '100%' }}
				ref={(ref) => {
					videoRef.value = ref;
				}}
				preload={'metadata'}
			>
			</video>
			Language
			<select>
				{useComputed(() => languages.value.map(l => (
					<option>{l}</option>
				)))}
			</select>
			Subtitle
			<select onChange={(ev) => {
				if (ev.currentTarget.value !== 'null') {
					playerRef.value.selectTextTrack(ev.currentTarget.value);
					playerRef.value.setTextTrackVisibility(true);
				} else {
					playerRef.value.setTextTrackVisibility(false);
				}
			}}>
				<option value="null">None</option>
				{useComputed(() => subtitles.value.map(l => (
					<option>{l.language}</option>
				)))}
			</select>
		</div>
	);
}
