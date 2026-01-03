import { ReadonlySignal } from '@preact/signals-react';
import { ILibrary } from 'ipmc-interfaces';

export const ILibraryNavigationServiceSymbol = Symbol.for('ILibraryNavigationService');

export interface ILibraryNavigationService {
	/**
	 * Checks if a specified {@link ILibrary} has subnavigation.
	 * @param library The {@link ILibrary} to check for.
	 * @returns Whether or not the {@link ILibrary} has a subnavigation.
	 */
	hasSubNavigation(library: ILibrary): boolean;

	/**
	 * Gets whether a {@link ILibrary} is active.
	 * @param library {@link ILibrary} check if its active.
	 * @param view if it should only be for a specific view.
	 */
	isActive(library: ILibrary, view?: string): ReadonlySignal<boolean>;

	/**
	 * Navigates to the specified {@link ILibrary} and view if set.
	 * @param library {@link ILibrary} to navigate to.
	 * @param view the specific view to navigate to.
	 */
	navigateTo(library: ILibrary, view?: string): void;

	/**
	 * Gets all available views for a {@link ILibrary}.
	 * @param library {@link ILibary} to get the views for.
	 */
	getViews(library: ILibrary): string[] | undefined;
}
