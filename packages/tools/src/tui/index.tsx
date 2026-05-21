import { exec } from 'child_process';
import { withFullScreen } from "fullscreen-ink";
import { exit } from 'process';
import { tempDir } from '../utils/tempDIr';
import { App } from './App';
import React from 'react';


const workDir = tempDir();

function checkDeps(): Promise<void> {
	return new Promise((resolve, reject) => {
		exec('ffmpeg -h', (ex) => {
			if (ex) {
				console.error('Fatal: ffmpeg is not installed or detected');
				reject(ex);
				exit(2);
			} else {
				resolve();
			}
		});
	});
}

await checkDeps();
const ink = withFullScreen(<App workDir={workDir} />);
await ink.start();

// Wait until it stops then clean up
//await ink.waitUntilExit();
workDir.clean();
