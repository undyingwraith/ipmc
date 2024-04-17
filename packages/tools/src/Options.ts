import { Options as YargOptions } from 'yargs';

// Interfaces
interface IOption {
	[key: string]: YargOptions;
}

interface IOptions {
	Default: IOption;
	Verbose: IOption;
	Key: IOption;
	Index: IOption;
	Thumbnails: IOption;
}

// Options
const VerboseOption: IOption = {
	v: {
		alias: 'verbose',
		default: false,
		describe: 'enable verbose logging',
		type: 'boolean',
	}
};

const KeyOption: IOption = {
	k: {
		alias: 'key',
		default: 'self',
		type: 'string',
	}
}

const IndexOption: IOption = {
	i: {
		alias: 'index',
		default: false,
		type: 'boolean',
	}
}

const ThumbnailsOption: IOption = {
	t: {
		alias: 'thumbnails',
		default: false,
		type: 'boolean',
	}
}

// Export
export const Options: IOptions = {
	Default: {
		...VerboseOption,
	},
	Verbose: VerboseOption,
	Key: KeyOption,
	Index: IndexOption,
	Thumbnails: ThumbnailsOption,
};
