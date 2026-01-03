import { IFileInfo } from 'ipmc-interfaces';

export const IMediaPreferenceServiceSymbol = Symbol.for('IMediaPreferenceService');

/**
 * Gets preferred values for a {@link IFileInfo}.
 */
export interface IMediaPreferenceService {
	/**
	 * Gets the preferred header for a {@link IFileInfo}.
	 * @param item the {@link IFileInfo} to get the header for.
	 */
	getHeader(item: IFileInfo): string;

	/**
	 * Gets the preferred subheader for a {@link IFileInfo}.
	 * @param item the {@link IFileInfo} to get the subheader for.
	 */
	getSubheader(item: IFileInfo): string | undefined;

	/**
	 * Gets the preferred poster for a {@link IFileInfo}.
	 * @param item the {@link IFileInfo} to get the poster for.
	 */
	getPoster(item: IFileInfo): IFileInfo | undefined;

	/**
	 * Gets the preferred thumbnail for a {@link IFileInfo}.
	 * @param item the {@link IFileInfo} to get the thumbnail for.
	 */
	getThumbnail(item: IFileInfo): IFileInfo | undefined;
}
