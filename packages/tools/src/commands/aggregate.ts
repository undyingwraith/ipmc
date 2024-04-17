import { IPFSHTTPClient } from "kubo-rpc-client/dist/src";
import { Options } from "../Options";
import { generateIndex } from "../generateIndex";
import { createNode } from "../utils/createNode";
import { createMultiProgress, createProgressFormat } from "../utils/Progress";
import { Options as YargOptions } from 'yargs';

export const Aggregate = {
	command: 'aggregate',
	aliases: ['a'],
	desc: '[WIP] Aggregate Libraries',
	builder: (yargs) => yargs.options({
		...Options.Default,
		...Options.Index,
		source: {
			alias: 's',
			type: 'string',
			required: true,
		} as YargOptions,
		target: {
			alias: 't',
			type: 'string',
			required: true,
		} as YargOptions
	}),
	handler: async (argv) => {
		const ipfs = createNode();
		await aggregate(ipfs, argv.source, argv.target);
		if (argv.index) {
			await generateIndex(ipfs, argv.target);
		}
	},
}

async function aggregate(ipfs: IPFSHTTPClient, source: string, target: string) {
	const progress = createMultiProgress();
	const mainProgress = progress.create(3, 0);

	try {
		await ipfs.files.rm(target, { recursive: true });//remove target //TODO: backup
	} catch (e) {
		progress.log(e.name + ': ' + e.message);
	}
	await ipfs.files.mkdir(target);
	mainProgress.increment();

	const channels: any[] = []
	for await (const channel of ipfs.files.ls(source)) {
		channels.push(channel);
	}
	mainProgress.increment();

	const channelProgress = progress.create(channels.length, 0, { channel: '' }, {
		format: createProgressFormat({ extra: '{channel}' })
	});
	for (const channel of channels) {
		channelProgress.update({ channel: channel.name });
		const files: any[] = []

		for await (const file of ipfs.files.ls(source + '/' + channel.name)) {
			files.push(file);
		}

		const fileProgress = progress.create(files.length, 0, { file: '' }, {
			format: createProgressFormat({ extra: '{file}' })
		});
		for (const file of files) {
			fileProgress.update({ file: file.name });
			try {
				await ipfs.files.cp(source + '/' + channel.name + '/' + file.name, target + '/' + file.name);
			} catch (e) {
				progress.log(`failed to copy <${file.name}> from <${channel.name}>`);
			}
			fileProgress.increment();
		}
		channelProgress.increment();
	}
	mainProgress.increment();
}
