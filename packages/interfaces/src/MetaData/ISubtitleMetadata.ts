/**
 * Metadata for a subtitle.
 */
export interface ISubtitleMetadata {
	/**
	 * The language of the subtitle.
	 */
	language: string;

	/**
	 * Whether or not the subtitle is forced.
	 */
	forced: boolean;

	/**
	 * The role of the subtitle.
	 */
	role: string;
}
