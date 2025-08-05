export const IFileExportServiceSymbol = Symbol.for('IFileExportService');

export interface IFileExportService {
	/**
	 * Exports a text file.
	 * @param contents text content of the file.
	 * @param filename name of the file.
	 */
	exportText(contents: string, filename: string): void;

	/**
	 * Exports a json file.
	 * @param contents content of the json file.
	 * @param filename name of the file.
	 */
	exportJson(contents: object, filename: string): void;

	/**
	 * Exports a file from a uri.
	 * @param uri uri of the file to export.
	 * @param filename name of the file.
	 */
	export(uri: string, filename: string): void;
}
