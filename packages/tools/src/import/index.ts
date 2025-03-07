import fs from 'fs';
import { partitionArray } from 'ipmc-core';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { importFiles } from './importFiles';

const args = yargs(hideBin(process.argv))
	.option('packager', {
		alias: 'p',
		describe: 'packager executable to use',
		default: 'shaka-packager',
	})
	.option('ipfs', {
		describe: 'ipfs api url',
		default: 'http://127.0.0.1:5002/api/v0'
	})
	.array('file')
	.alias('file', 'f')
	.demandOption(['file'])
	.help()
	.parseSync();

(async () => {
	const paths = args.file as string[];

	const [directories, files] = partitionArray(paths, path => fs.lstatSync(path).isDirectory());

	for (const dir of directories) {
		await importFiles(fs.readdirSync(dir).map(name => path.join(dir, name)), args.packager, args.ipfs);
	}

	if (files.length > 0) {
		await importFiles(files, args.packager, args.ipfs);
	}

	console.log('Done!');
})();
