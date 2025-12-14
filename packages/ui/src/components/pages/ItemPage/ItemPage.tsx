import { computed, useComputed } from '@preact/signals-react';
import { IFileInfo, isBackdropFeature, isIFolderFile, isIVideoFile } from 'ipmc-interfaces';
import React from 'react';
import { useFileUrl, usePersistentSignal, useTranslation } from '../../../hooks';
import { FileInfoDisplay, LanguageDisplay, VideoMetadataDisplay } from '../../atoms';
import { Display } from '../../molecules';
import { MediaItemActions } from '../../molecules/MediaItemActions';
import { FileGrid, FileList } from '../../organisms';
import styles from './ItemPage.module.css';


export function ItemPage(props: {
	item: IFileInfo;
}) {
	const file = props.item;
	const _t = useTranslation();

	const display = usePersistentSignal<Display>(Display.Poster, 'display');
	const backdropUrl = useFileUrl(isBackdropFeature(file) && file.backdrops.length > 0 ? file.backdrops[0]?.cid : undefined);

	const items = isIFolderFile(file) ? (file.items.length === 1 && isIFolderFile(file.items[0]) ? file.items[0].items : file.items) : [];

	const details = (
		<div className={styles.details}>
			<FileInfoDisplay file={file} />
			{isIVideoFile(file) && (
				<VideoMetadataDisplay file={file} />
			)}
			{(isIVideoFile(file) || isIFolderFile(file)) && <LanguageDisplay file={file} />}
			<MediaItemActions file={file} fullwidth={true} variant={'full'} />
		</div>
	);

	return useComputed(() => (
		<div style={{ backgroundImage: backdropUrl.value ? `url('${backdropUrl.value}')` : 'none' }} className={styles.container}>
			{isIFolderFile(file) ? (
				items.length === 0 ? (
					<>
						{details}
						<span>{_t('NoItems')}</span>
					</>
				) : computed(() => {
					const header = {
						height: 350,
						content: details,
					};
					return (
						display.value == Display.List ? (
							<FileList
								files={items}
								header={header}
							/>
						) : (
							<FileGrid
								header={header}
								display={display}
								files={items}
							/>
						)
					);
				})
			) : details}
		</div>
	));
}
