import { useComputed } from '@preact/signals-react';
import { IFileInfo, isIEpisodeMetadata, isIFolderFile } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../../context';
import { useFileUrl } from '../../../hooks';
import { IMediaPreferenceService, IMediaPreferenceServiceSymbol } from '../../../services';
import { EpisodeDisplay } from '../EpisodeDisplay';
import styles from './FileInfoDisplay.module.css';

export function FileInfoDisplay(props: { file: IFileInfo; }) {
	const { file } = props;
	const mediaService = useService<IMediaPreferenceService>(IMediaPreferenceServiceSymbol);
	const posterUrl = useFileUrl(mediaService.getPoster(file)?.cid);

	return (
		<div className={styles.container}>
			{useComputed(() => posterUrl.value ? (<img src={posterUrl.value} style={{ height: 250, flexGrow: 0 }} />) : undefined)}
			<div className={styles.textContainer}>
				<h3>{mediaService.getHeader(file)}</h3>
				{isIFolderFile(file) && <EpisodeDisplay file={file} />}
				{isIEpisodeMetadata(file) && <p>{file.series} - S{file.season}E{file.episode}</p>}
			</div>
		</div>
	);
}
