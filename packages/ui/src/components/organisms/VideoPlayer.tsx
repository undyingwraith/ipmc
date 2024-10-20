import { useSignal, useSignalEffect } from '@preact/signals-react';
import { IIpfsService, IIpfsServiceSymbol, IVideoFile } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context';
import { useHotkey } from '../../hooks';
import shaka from 'shaka-player';

function createShakaIpfsPlugin(ipfs: IIpfsService): shaka.extern.SchemePlugin {
	return async (uri: string, request: shaka.extern.Request, requestType: shaka.net.NetworkingEngine.RequestType, progressUpdated: shaka.extern.ProgressUpdated, headersReceived: shaka.extern.HeadersReceived, config: shaka.extern.SchemePluginConfig) => {
		const path = uri.substring(uri.indexOf('://') + 3);
		const paths = path.split('/');
		let cid = paths.shift()!;

		while (paths.length > 0) {
			const filename = paths.shift();
			const files = await ipfs.ls(cid);

			const file = files.find(f => f.name === filename);
			if (!file) {
				throw new Error('File Not Found');
			}
			cid = file.cid;
		}

		console.log(uri, path, cid, request, requestType, config);
		headersReceived({});

		const data = await ipfs.fetch(cid);

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

	useHotkey({ key: 'F' }, () => {
		videoRef.value?.requestFullscreen();
	});

	useSignalEffect(() => {
		if (videoRef.value != null) {
			shaka.net.NetworkingEngine.registerScheme('ipfs', createShakaIpfsPlugin(ipfs), 1, false);
			const player = new shaka.Player();
			playerRef.value = player;
			player.attach(videoRef.value)
				.then(() => player.load(`ipfs://QmediiYR5uAswBjrDGXFhR2BHk9j9Fe3v7tZbfeF3Qe4oa/video.mpd`))
				//.then(() => player.load(`ipfs://${props.file.cid}/${props.file.video.name}`))
				.then(() => {
					console.log('player ready');
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
		<video
			controls
			style={{ height: '85vh', maxWidth: '100%', maxHeight: '100%' }}
			ref={(ref) => {
				videoRef.value = ref;
			}}
			preload={'metadata'}
		>
		</video>
	);
}
