import { CID, create } from 'kubo-rpc-client';
import { IPFSEntry } from 'kubo-rpc-client/dist/src/types';

const importPath = '/import'
const node = create();

function isVideoFile(file: IPFSEntry) {
	return file.type == 'file' && file.name.endsWith('.mp4')
}

function isImageFile(file: IPFSEntry) {
	return file.type == 'file' && ['jpg', 'jpeg', 'png'].some(ext => file.name.endsWith(`.${ext}`))
}

(async () => {
	for (const arg of process.argv.slice(2)) {
		console.log("attempting import of " + arg)
		try {
			const cid = CID.parse(arg);
			const files: IPFSEntry[] = [];
			for await (const file of node.ls(cid)) {
				files.push(file);
			}

			for (const video of files.filter(isVideoFile)) {
				try {
					const name = video.name.substring(0, video.name.lastIndexOf('.'));
					const path = `${importPath}${importPath.endsWith('/') ? '' : '/'}${name}`;

					const related = files.filter(f => f.name != video.name && f.name.startsWith(name));
					const thumbs = related.filter(isImageFile);

					console.debug(`creating dir ${path}`);
					await node.files.mkdir(path);
					
					console.debug(`copying video file to ${path}/${video.name}`)
					await node.files.cp(video.cid, `${path}/${video.name}`);
					
					for (let i = 0; i < thumbs.length; i++) {
						console.debug(`copying thumbnail to ${path}/thumb${i > 0 ? i : ''}.jpg`)
						await node.files.cp(thumbs[i].cid, `${path}/thumb${i > 0 ? i : ''}.jpg`);
					}
					
					console.log('imported' , name)
				
				} catch (e) {
					console.error(`Failed to import video ${video.name}`, e);
				}
			}
		} catch (e) {
			console.error(`Failed to import directory ${arg}`, e);
		}
	}
})()