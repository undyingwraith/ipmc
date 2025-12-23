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
	 * caption - textual media component containing transcriptions of spoken dialog and auditory cues such as sound effects and music for the hearing impaired.
	 * subtitle - textual transcriptions of spoken dialog.
	 * forced-subtitle - Textual information meant for display when no other text representation is selected. It is used to clarify dialogue, alternate languages, texted graphics or location/person IDs that are not otherwise covered in the dubbed/localized audio.
	 */
	role: string;
}
