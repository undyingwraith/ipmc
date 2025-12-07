export const IVersionServiceSymbol = Symbol.for('IVersionService');

export interface IVersionService {
	getVersion(): string;
	getIndexerVersions(): { name: string, version: string; }[];
}
