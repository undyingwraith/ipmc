import fs from 'fs';

export interface ITempDir {
	getPath(filename?: string): string;
	clean(leaveDir?: boolean): void;
}

export function tempDir(): ITempDir {
	const id = crypto.randomUUID();
	const path = `./tmp/${id}`;

	function getPath(filename?: string): string {
		return filename == undefined ? path : `${path}/${filename}`;
	}

	function clean(leaveDir = false): void {
		if (fs.existsSync(path)) {
			const stat = fs.statSync(path);
			if (stat.isFile()) {
				fs.rmSync(path);
				leaveDir && fs.mkdirSync(path);
			} else {
				const files = fs.readdirSync(path);
				files.forEach(f => fs.rmSync(getPath(f), { recursive: true, force: true }));
				if (!leaveDir) {
					fs.rmdirSync(path);
				}
			}
		} else if (leaveDir) {
			fs.mkdirSync(path);
		}
	}

	clean(true);
	return {
		getPath,
		clean,
	};
}
