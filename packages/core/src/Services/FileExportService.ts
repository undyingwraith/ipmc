import { injectable } from 'inversify';

@injectable()
export class FileExportService {
	exportText(contents: string, filename: string) {
		const uri = "data:text/plain;charset=utf-8," + encodeURIComponent(contents);
		this.export(uri, filename);
	}

	exportJson(obj: object, filename: string) {
		const uri = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
		this.export(uri, filename);
	}

	export(uri: string, filename: string): void {
		var link = document.createElement("a");
		link.download = filename;
		link.href = uri;
		link.click();
	}
}
