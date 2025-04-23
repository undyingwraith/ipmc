import { HasPinAbility, HasPoster, HasTitle, HasYear } from '../Features';
import { IMusicFile } from '../IMusicFile';
import { IFolderFile } from '../IFolderFile';

export type IMusicMetaData = IMusicFile & HasPoster & HasPinAbility & HasYear & HasTitle;
export type IAlbumMetaData = IFolderFile & HasPoster & HasPinAbility;
//TODO
//export type IArtistMetaData = IFolderFile & HasPoster & HasPinAbility;


