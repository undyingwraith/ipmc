export interface ILibraryCapabilities {
	/**
	 * Whether the items have posters.
	 */
	hasPoster: boolean;

	/**
	 * Whether the items have thumbnails.
	 */
	hasThumbnail: boolean;

	/**
	 * Subviews of the {@link ILibrary} if there are any.
	 */
	views: string[] | undefined;
}
