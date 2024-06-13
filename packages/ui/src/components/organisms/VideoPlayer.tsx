import React, { useRef } from 'react';
import { IVideoFile } from 'ipmc-interfaces';
import { useProfile } from '../../context/ProfileContext';
import { useHotkey } from '../../hooks';

export function VideoPlayer(props: { file: IVideoFile; }) {
	const { ipfs } = useProfile();
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
