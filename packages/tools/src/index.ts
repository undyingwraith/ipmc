import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { create } from 'kubo-rpc-client';
import { generateThumbnails } from './generateThumbnails';
import { generateIndex } from './generateIndex';
import { publish } from './publish';
import { Options } from './Options';
import { Aggregate } from './commands/aggregate';
import { Channels } from './commands/channels';

const node = create();

// @ts-ignore
yargs(hideBin(process.argv))
	.command<{ path: string, index: boolean, thumbnails: boolean }>({
		command: 'generate <path>',
		aliases: ['g', 'gen'],
		desc: '[WIP] Generate missing thumbnails and such',
		builder: (yargs) => yargs.options({
			...Options.Default,
			...Options.Index,
			...Options.Thumbnails,
		}),
		handler: async (argv) => {
			if (argv.thumbnails) {
				await generateThumbnails(node, argv.path);
			}
			if (argv.index) {
				await generateIndex(node, argv.path);
			}
		},
	})
	.command(Aggregate)
	.command(Channels)
	.command<{ path: string }>('import <cid>', 'Import from ipfs', (yargs) => yargs.options(Options.Default), (argv) => {
		console.info(argv)
	})
	.command<{ path: string, key?: string }>(
		'publish <path>',
		'Publish MFS folder to IPNS',
		(yargs) => yargs.options({
			...Options.Default,
			...Options.Key,
		}),
		(argv) => {
			publish(node, argv.path, argv.key);
		}
	)
	.demandCommand()
	.help()
	.parse();
