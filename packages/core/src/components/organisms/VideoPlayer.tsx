import React from 'react';
import { IVideoFile } from '../../service';
import { useApp } from '../pages/AppContext';

export function VideoPlayer(props: { file: IVideoFile; }) {
	const { ipfs } = useApp();

	return (
		<video controls style={{ maxWidth: '100%', maxHeight: '100%' }}>
			<source src={ipfs.toUrl(props.file.video.cid)}></source>
		</video>
	);
}
