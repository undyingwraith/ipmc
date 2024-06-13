import React from 'react';
import { IVideoFile } from 'ipmc-interfaces';
import { useProfile } from '../pages/ProfileContext';

export function VideoPlayer(props: { file: IVideoFile; }) {
	const { ipfs } = useProfile();

	return (
		<video controls style={{ height: '85vh', maxWidth: '100%', maxHeight: '100%' }}>
			<source src={ipfs.toUrl(props.file.video.cid)}></source>
		</video>
	);
}
