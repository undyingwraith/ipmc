import { IPFSHTTPClient } from "kubo-rpc-client/dist/src";
import { Options } from "../Options";
import { generateIndex } from "../generateIndex";
import { createNode } from "../utils/createNode";
import { createMultiProgress, createProgressFormat } from "../utils/Progress";
import { Options as YargOptions } from 'yargs';
import { ICreateCommand } from "./ICreateCommand";
import { generateThumbnails } from "../generateThumbnails";

export const createChannelsCommand: ICreateCommand<{
	command: string,
	path: string,
}> = (runner) => {
	return {
		command: 'channels <path> [command]',
		aliases: ['c'],
		desc: 'Run command for multiple channels.',
		builder: (yargs) => yargs.command({
			command: 'generate',
			builder: (yargs) => yargs.options({
				...Options.Default,
				...Options.Index,
				...Options.Thumbnails,
			}),
		}),
		handler: async (argv) => {
			await Promise.resolve(runner(argv));
		},
	}
}

export const Channels = createChannelsCommand(async (argv) => {
	const ipfs = createNode();
	await runEach(ipfs, argv.path, argv.command);
});

async function runEach(ipfs: IPFSHTTPClient, path: string, command: string) {
	const progress = createMultiProgress();

	const channels: any[] = []
	for await (const channel of ipfs.files.ls(path)) {
		channels.push(channel);
	}

	const channelProgress = progress.create(channels.length, 0, { channel: '' }, {
		format: createProgressFormat({ extra: '{channel}' })
	});
	for (const channel of channels) {
		channelProgress.update({ channel: channel.name });

		switch(command) {
			case 'generate':
				await generateThumbnails(ipfs, path + '/' + channel.name, progress);
		}

		channelProgress.increment();
	}
}
