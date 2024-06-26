import { IFileInfo } from 'ipmc-interfaces';

export function createFilter(query: string): ((item: IFileInfo) => boolean) {
	return (item: IFileInfo) => (
		matchName(item, query)
	);
}


function matchName(item: IFileInfo, query: string): boolean {
	return item.name.toLocaleLowerCase().includes(query.toLowerCase());
}
