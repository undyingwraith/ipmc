import { ReadonlySignal } from '@preact/signals-react';
import { IFileInfo, ILibrary } from 'ipmc-interfaces';
import { ILibraryCapabilities } from './ILibraryCapabilities';

export const ILibraryServiceSymbol = Symbol.for('ILibraryService');

export interface ILibraryService {
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
	 * Gets all {@link ILibraryCapabilities} of the specified {@link ILibrary}.
	 * @param library the {@link ILibrary} to check for.
	 */
	getCapabilities(library: ILibrary): ILibraryCapabilities;

	/**
	 * The currently active {@link ILibrary}.
	 */
	active: ReadonlySignal<{ library: ILibrary, view?: string; } | undefined>;

	/**
	 * The the items of the currently active {@link ILibrary}.
	 */
	activeLibraryItems: ReadonlySignal<IFileInfo[] | undefined>;
}
