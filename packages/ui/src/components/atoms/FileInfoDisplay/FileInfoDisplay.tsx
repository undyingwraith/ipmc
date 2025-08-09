import { useComputed } from '@preact/signals-react';
import { IFileInfo, isIEpisodeMetadata, isPosterFeature } from 'ipmc-interfaces';
import React from 'react';
import { useFileUrl } from '../../../hooks';
import { useTitle } from '../../../hooks/useTitle';
import styles from './FileInfoDisplay.module.css';

export function FileInfoDisplay(props: { file: IFileInfo; }) {
	const { file } = props;
	const title = useTitle(file);
	const posterUrl = useFileUrl(isPosterFeature(file) && file.posters.length > 0 ? file.posters[0]?.cid : undefined);

	return (
		<div className={styles.container}>
			{useComputed(() => posterUrl.value ? (<img src={posterUrl.value} style={{ height: 250, flexGrow: 0 }} />) : undefined)}
			<div className={styles.textContainer}>
				<h3>{title}</h3>
				{isIEpisodeMetadata(file) && <p>{file.series} - S{file.season}E{file.episode}</p>}
			</div>
		</div>
	);
}
