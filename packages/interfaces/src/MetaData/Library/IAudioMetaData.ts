import { HasPinAbility, HasPoster, HasTitle, HasYear } from '../Features';
import { IAudioFile } from '../IAudioFile';
import { IFolderFile } from '../IFolderFile';

/**
 * The metadata of a piece of Audio.
 */
export type IAudioMetaData = IAudioFile & HasPinAbility & HasYear & HasTitle;

/**
 * The metadata of an Album.
 */
export type IAlbumMetaData = IFolderFile & HasPoster & HasPinAbility;

/**
 * The metadata of an Artist.
 */
export type IArtistMetaData = IFolderFile & HasPoster & HasPinAbility;

