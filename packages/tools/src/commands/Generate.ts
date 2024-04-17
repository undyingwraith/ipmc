import { ICreateCommand } from "./ICreateCommand";

export const createGenerateCommand: ICreateCommand<{ path: string, index: boolean, thumbnails: boolean }> = (runner) => ({
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
});