import { computed, ReadonlySignal } from '@preact/signals-react';
import { inject, injectable } from 'inversify';
import { IAlbumMetadata, IAudioMetaData, IFileInfo, IFolderFile, type IIndexManager, IIndexManagerSymbol, ILibrary, type IProfile, IProfileSymbol } from 'ipmc-interfaces';
import { type INavigationService, INavigationServiceSymbol } from '../NavigationService';
import { ILibraryCapabilities } from './ILibraryCapabilities';
import { ILibraryService } from './ILibraryService';

@injectable()
export class LibraryService implements ILibraryService {
	constructor(
		@inject(INavigationServiceSymbol) private readonly navigation: INavigationService,
		@inject(IIndexManagerSymbol) private readonly indexManager: IIndexManager,
		@inject(IProfileSymbol) private readonly profile: IProfile,
	) { }

	/**
	 * @inheritdoc
	 */
	isActive(library: ILibrary, view?: string): ReadonlySignal<boolean> {
		return computed(() => {
			const active = this.active.value;
			if (view && active?.view?.toLowerCase() !== view.toLowerCase()) {
				return false;
			}
			return library.id === active?.library.id;
		});
	}

	/**
	 * @inheritdoc
	 */
	navigateTo(library: ILibrary, view?: string): void {
		const url = `/${library.id}`;
		if (this.hasSubNavigation(library)) {
			const params = new URLSearchParams(window.location.search);
			if (view) {
				params.set(this.viewKey, view.toLowerCase());
			} else if (!params.has(this.viewKey)) {
				params.set(this.viewKey, this.getDefaultView(library)!.toLowerCase());
			}
			this.navigation.navigate(url, params);
		} else {
			this.navigation.navigate(url, new URLSearchParams());
		}
	}

	/**
	 * @inheritdoc
	 */
	hasSubNavigation(library: ILibrary): boolean {
		return library.type === 'music';
	}

	/**
	 * @inheritdoc
	 */
	getDefaultView(library: ILibrary): string | undefined {
		const views = this.getCapabilities(library).views;
		if (views && views.length > 0) {
			return views[0];
		}
		return undefined;
	}

	/**
	 * @inheritdoc
	 */
	getCapabilities(library: ILibrary): ILibraryCapabilities {
		switch (library.type) {
			case 'movie':
			case 'series':
				return {
					hasPoster: true,
					hasThumbnail: true,
					views: undefined,
				};
			case 'music':
				return {
					hasPoster: false,
					hasThumbnail: false,
					views: ['Songs', 'Artists', 'Albums'],
				};
			default:
				return {
					hasPoster: false,
					hasThumbnail: false,
					views: undefined,
				};
		}
	}

	/**
	 * @inheritdoc
	 */
	public active = computed(() => {
		const params = this.navigation.params.value;
		const path = this.navigation.path.value;

		for (const lib of this.profile.libraries) {
			if (path.startsWith('/' + lib.id)) {
				const views = this.getCapabilities(lib).views;
				if (views && params.has(this.viewKey)) {
					const active = views.find(v => v.toLowerCase() === params.get(this.viewKey));
					return {
						library: lib,
						view: active,
					};
				}

				return {
					library: lib,
				};
			}
		}

		return undefined;
	});

	public activeLibraryItems = computed(() => {
		const current = this.active.value;
		if (current) {
			const index = this.indexManager.indexes.get(current.library.id)?.value?.index as IFileInfo[];
			if (current.library.type == "music") {
				const data = index as IAlbumMetadata[];
				switch (current.view) {
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
				}
			}

			return index;
		}

		return undefined;
	});

	private readonly viewKey = 'view';
}
