import { IFileInfo } from "../indexer";

export interface IGenericMetaData<T extends string> {
	file: IFileInfo;
}
