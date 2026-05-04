import { TDisplay } from './TDisplay';

export interface ILibraryCapabilities {
	/**
	 * The supported {@link TDisplay} types.
	 */
	displays: TDisplay[];

	/**
	 * Subviews of the {@link ILibrary} if there are any.
	 */
	views: string[] | undefined;
}
