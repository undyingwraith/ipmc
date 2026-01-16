import { Box } from '@mui/material';
import { useComputed, useSignal } from '@preact/signals-react';
import { IAudioMetaData, IFileInfo, IFolderFile, IIndexManager, IIndexManagerSymbol, ISortAndFilterService, ISortAndFilterServiceSymbol } from 'ipmc-interfaces';
import React from 'react';
import { useService } from '../../context/AppContext';
import { usePersistentSignal, useTranslation } from '../../hooks';
import { LoadScreen } from '../molecules';
import { Display } from '../molecules/DisplayButtons';
import { FileGrid, FileList } from '../organisms';
import { ILibraryServiceSymbol, LibraryService } from 'src/services';
import { IAlbumMetadata } from 'ipmc-interfaces/dist/MetaData/Library/IAudioMetaData';

export function LibraryPage(props: {
	library: string;
}) {
	const { library } = props;
	const _t = useTranslation();

	const indexManager = useService<IIndexManager>(IIndexManagerSymbol);
	const sortAndFilterService = useService<ISortAndFilterService>(ISortAndFilterServiceSymbol);
	const libraryNavigationService = useService<LibraryService>(ILibraryServiceSymbol);

	const query = useSignal('');
	const display = usePersistentSignal<Display>(Display.Poster, 'display');

	var index = indexManager.indexes.get(library)!;
	let notSorted = useComputed(() => {
		const data = index.value!.index as IAlbumMetadata[];
		switch (libraryNavigationService.active.value?.view) {
			case "Songs":
				let newSongList = new Array<IAudioMetaData>;
				for (const album of data) {
					for (const song of album.items) {
						newSongList.push(song);
					}
				}
				return newSongList;
			case "Albums":
				return data;
			case "Artists":
				const properArtistMap: (IFolderFile<IAlbumMetadata>)[] = [];
				for (const album of data) {
					const artists = Array.from(new Set(album.items.map(i => i.artist.split('\\')).flat()));
					for (const artist of artists) {
						const existing = properArtistMap.find(a => a.name === artist);
						if (existing) {
							existing.items.push(album);
						} else {
							properArtistMap.push({
								name: artist,
								cid: artist, //TODO: maybe use a better value here
								items: [album],
								type: 'dir',
							});
						}
					}
				}
				return properArtistMap;
			default:
				return null;
		}
	});
	console.log("not sorted" + notSorted);
	let sorted = useComputed(() =>
		notSorted.value == undefined ? undefined : sortAndFilterService.createFilteredList<IFileInfo>(notSorted.value, query.value)
	);


	return useComputed(() => {
		return sorted.value == undefined ? (
			<LoadScreen />
		) : (
			sorted.value.length === 0 ? (
				<Box>{_t('NoItems')}</Box>
			) : display.value == Display.List ? (
				<FileList
					files={sorted.value}
				/>
			) : (
				<FileGrid
					display={display}
					files={sorted.value}
				/>
			)
		);
	});
}
