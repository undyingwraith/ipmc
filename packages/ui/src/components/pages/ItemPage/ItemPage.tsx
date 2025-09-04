import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Typography } from '@mui/material';
import { computed, useComputed } from '@preact/signals-react';
import { IFileInfo, isBackdropFeature, isIFolderFile, isIVideoFile } from 'ipmc-interfaces';
import React from 'react';
import { useAppbarButtons, useFileUrl, usePersistentSignal, useTitle, useTranslation } from '../../../hooks';
import { IAppbarButtonOptions } from '../../../services/AppbarButtonService';
import { FileInfoDisplay, LanguageDisplay } from '../../atoms';
import { Display, DisplayButtons } from '../../molecules';
import { MediaItemActions } from '../../molecules/MediaItemActions';
import { FileGrid, FileList } from '../../organisms';
import styles from './ItemPage.module.css';


export function ItemPage(props: {
	item: IFileInfo;
}) {
	const file = props.item;
	const _t = useTranslation();
	const title = useTitle(file);

	const display = usePersistentSignal<Display>(Display.Poster, 'display');
	const backdropUrl = useFileUrl(isBackdropFeature(file) && file.backdrops.length > 0 ? file.backdrops[0]?.cid : undefined);

	useAppbarButtons([
		{
			component: (
				<Button onClick={() => history.back()} startIcon={<ArrowBackIcon />}>{_t('Back')}</Button>
			),
			position: 'start'
		},
		{
			component: (
				<Typography>{title}</Typography>
			),
			position: 'start'
		},
		...(isIFolderFile(file) ? [
			{
				component: (<DisplayButtons display={display} />),
				position: 'end',
			}
		] as IAppbarButtonOptions[] : []),
	]);
	const items = isIFolderFile(file) ? (file.items.length === 1 && isIFolderFile(file.items[0]) ? file.items[0].items : file.items) : [];

	return useComputed(() => (
		<div style={{ backgroundImage: backdropUrl.value ? `url('${backdropUrl.value}')` : 'none' }} className={styles.container}>
			<div className={styles.details}>
				<FileInfoDisplay file={file} />
				{(isIVideoFile(file) || isIFolderFile(file)) && <LanguageDisplay file={file} />}
				<MediaItemActions file={file} fullwidth={true} variant={'full'} />
			</div>
			{isIFolderFile(file) && (
				<div className={styles.items}>
					{items.length === 0 ? (
						<span>{_t('NoItems')}</span>
					) : computed(() => (
						display.value == Display.List ? (
							<FileList
								files={items}
							/>
						) : (
							<FileGrid
								display={display}
								files={items}
							/>
						))
					)}
				</div>
			)}
		</div>
	));
}
