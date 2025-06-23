import { HasPinAbility, HasPoster, HasTitle, HasYear } from '../Features';
import { IMusicFile } from '../IMusicFile';
import { IFolderFile } from '../IFolderFile';

/**
 * The metadata of a piece of Music.
 */
export type IMusicMetaData = IMusicFile & HasPinAbility & HasYear & HasTitle;

/**
 * The metadata of an Album.
 */
export type IAlbumMetaData = IFolderFile & HasPoster & HasPinAbility;

/**
 * The metadata of an Artist.
 */
export type IArtistMetaData = IFolderFile & HasPoster & HasPinAbility;

