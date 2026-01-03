import { computed, ReadonlySignal } from '@preact/signals-react';
import { inject, injectable } from 'inversify';
import { ILibrary } from 'ipmc-interfaces';
import { type INavigationService, INavigationServiceSymbol } from '../NavigationService';
import { ILibraryNavigationService } from './ILibraryNavigationService';

@injectable()
export class LibraryNavigationService implements ILibraryNavigationService {
	constructor(
		@inject(INavigationServiceSymbol) private readonly navigation: INavigationService,
	) { }

	/**
	 * @inheritdoc
	 */
	isActive(library: ILibrary, view?: string): ReadonlySignal<boolean> {
		return computed(() => {
			const params = this.navigation.params.value;
			const path = this.navigation.path.value;
			if (view && !(params.has(this.viewKey) && params.get(this.viewKey) === view.toLowerCase())) {
				return false;
			}
			return path.startsWith('/' + library.id);

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
		if (library.type === 'music') {
			return this.getViews(library)![0];
		}
		return undefined;
	}

	/**
	 * @inheritdoc
	 */
	getViews(library: ILibrary): string[] | undefined {
		if (library.type === 'music') {
			return ['Songs', 'Artists', 'Albums'];
		}
		return undefined;
	}

	public readonly viewKey = 'view';
}
