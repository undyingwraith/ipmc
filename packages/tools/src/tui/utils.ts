import { exec } from 'child_process';

export function promiseExec(cmd: string): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(cmd, (ex, stdout, stderr) => {
			if (ex) {
				reject(ex);
			} else {
				resolve(stdout);
			}
		});
	});
}
