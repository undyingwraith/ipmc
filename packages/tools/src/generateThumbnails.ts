import { IPFSEntry, IPFSHTTPClient } from "kubo-rpc-client/types";
import { Regexes } from 'ipm-core';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import cliProgress from 'cli-progress';
import { createMultiProgress, createProgressFormat } from "./utils/Progress";

export async function generateThumbnails(ipfs: IPFSHTTPClient, path: string, parentProgress?: cliProgress.MultiBar) {
	const progress = parentProgress ?? createMultiProgress();
	if (!parentProgress) {
		progress.log(`Fetching files from <${path}>\n`);
	}

	const files: any[] = [];
	for await (const file of ipfs.files.ls(path)) {
		files.push(file);
	}

	const checking = progress.create(files.length, 0, { file: '?' }, {
		format: createProgressFormat({ extra: '{file}' })
	});
	for (const file of files) {
		checking.update({ file: file.name });

		try {
			await generateForFile(path, file, progress, ipfs);
		} catch (ex) {
			progress.log(ex.message + '\n');
		}

		checking.increment();
	}
}

async function generateForFile(path: string, file: IPFSEntry, progress: cliProgress.MultiBar, ipfs: IPFSHTTPClient) {
	const components: IPFSEntry[] = [];

	for await (const comp of ipfs.ls(file.cid)) {
		components.push(comp);
	}

	if (!components.some(c => Regexes.Thumbnail.exec(c.name))) {
		const videoFile = components.find(c => Regexes.VideoFile.exec(c.name));
		if (!videoFile) {
			throw new Error(`No Video file found for <${file.name}> ${file.cid.toString()}`);
		}
		const fileProgress = progress.create(4, 0, { step: 'Preparing...' }, {
			format: `| ${file.name} |{bar}| {percentage}% || {value}/{total} || {step}`,
		});
		const updater = setInterval(() => {
			fileProgress.updateETA();
		}, 1000);
		cleanTempDir();

		// Write video to disk
		fileProgress.update(1, { step: 'Writing video to disk...' });
		const stream = fs.createWriteStream('./tmp/video.mp4');
		for await (const chunk of ipfs.cat(videoFile.cid)) {
			stream.write(chunk);
		}
		stream.close();

		// Generate thumbnails
		fileProgress.update(2, { step: 'Generating thumbnails...' });
		await new Promise(resolve => ffmpeg('./tmp/video.mp4', {
			priority: 0,
		})
			.inputOptions('-threads 1')
			.takeScreenshots({
				count: 10,
				fastSeek: false,
				size: '640x360',
				filename: 'thumb%i.png',
			}, './tmp')
			.once('end', resolve));
		fileProgress.update(3);

		// Remove video
		fs.rmSync('./tmp/video.mp4');

		// Add thumbnails
		const files = fs.readdirSync('./tmp');
		for (const localFile of files) {
			const { cid } = await ipfs.add(fs.createReadStream(`./tmp/${localFile}`), {
				pin: false,
			});
			ipfs.files.cp(cid, `${path}/${file.name}/${localFile}`)
			fs.rmSync(`./tmp/${localFile}`);
		}
		fileProgress.update(4);

		clearInterval(updater);
	}
}

function cleanTempDir() {
	if (fs.existsSync('./tmp')) {
		const stat = fs.statSync('./tmp');
		if (stat.isFile()) {
			fs.rmSync('./tmp');
			fs.mkdirSync('./tmp');
		} else {
			const files = fs.readdirSync('./tmp');
			files.forEach(f => fs.rmSync(`./tmp/${f}`))
		}
	} else {
		fs.mkdirSync('./tmp');
	}
}
