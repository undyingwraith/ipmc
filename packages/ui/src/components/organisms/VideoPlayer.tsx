import React, { useRef } from 'react';
import { IIpfsService, IIpfsServiceSymbol, IVideoFile } from 'ipmc-interfaces';
import { useHotkey } from '../../hooks';
import { useService } from '../../context';

export function VideoPlayer(props: { file: IVideoFile; }) {
	const ipfs = useService<IIpfsService>(IIpfsServiceSymbol);
	const videoRef = useRef<HTMLVideoElement>(null);

	useHotkey({ key: 'F' }, () => {
		videoRef.current?.requestFullscreen();
	});

	return (
		<video controls style={{ height: '85vh', maxWidth: '100%', maxHeight: '100%' }} ref={videoRef} preload={'metadata'}>
			<source src={ipfs.toUrl(props.file.video.cid)}></source>
		</video>
	);
}
